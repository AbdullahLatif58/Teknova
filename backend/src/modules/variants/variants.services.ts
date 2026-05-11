
import { pool } from "../../config/db";
import { ProductVariant } from "./variants.model";
import { generateUUID } from "../../utils/uuui";
import { uploadToCloudinary, deleteFromCloudinary, getPublicIdFromUrl } from "../../utils/fileHandling";



async function checkStockAvailability(product_id: string, additionalStock: number, excludeVariantId?: string) {
  const [productRows] = await pool.query("SELECT total_stock FROM products WHERE id = ?", [product_id]);
  if ((productRows as any[]).length === 0) throw new Error("Product not found");
  const productTotalStock = (productRows as any)[0].total_stock;

  let query = "SELECT SUM(stock) as total FROM product_variants WHERE product_id = ?";
  const params: any[] = [product_id];
  if (excludeVariantId) {
    query += " AND id != ?";
    params.push(excludeVariantId);
  }

  const [variantRows] = await pool.query(query, params);
  const currentVariantStock = Number((variantRows as any)[0].total || 0);

  if (currentVariantStock + additionalStock > productTotalStock) {
    throw new Error(`Total variant stock (${currentVariantStock + additionalStock}) would exceed product total stock (${productTotalStock}). Current total variant stock: ${currentVariantStock}`);
  }
}

export async function createVariant(
  variantData: ProductVariant,
  imageFiles?: Express.Multer.File[]
): Promise<ProductVariant> {
  const {
    product_id,
    price,
    sku,
    stock,
    is_default,
    is_active,
    specifications,
  } = variantData;

  await checkStockAvailability(product_id, stock || 0);


  let uploadedImages: string[] = [];
  try {
    if (imageFiles && imageFiles.length > 0) {
      for (const file of imageFiles) {
        const url = await uploadToCloudinary(file.buffer, "variants");
        uploadedImages.push(url);
      }
    }

    const id = generateUUID();

    await pool.query(
      `INSERT INTO product_variants
      (id, product_id, price, sku, stock, image_url, is_default, is_active, specifications)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        product_id,
        price,
        sku || null,
        stock,
        uploadedImages.length > 0 ? JSON.stringify(uploadedImages) : null,
        is_default ?? false,
        is_active ?? true,
        specifications ? JSON.stringify(specifications) : null,
      ]
    );


    return {
      id,
      product_id,
      price,
      sku: sku || null,
      stock,
      image_url: JSON.stringify(uploadedImages),
      is_default: is_default ?? false,
      is_active: is_active ?? true,
      specifications: specifications || null,
    };

  } catch (err) {
    if (uploadedImages.length > 0) {
      for (const url of uploadedImages) {
        const publicId = getPublicIdFromUrl(url);
        await deleteFromCloudinary(publicId).catch((e) =>
          console.error("Rollback failed for image:", publicId, e)
        );
      }
    }
    throw err;
  }
}


export async function getVariantsByProduct(product_id: string): Promise<ProductVariant[]> {
  const [rows] = await pool.query(
    "SELECT * FROM product_variants WHERE product_id = ?",
    [product_id]
  );

  return (rows as any[]).map((row) => ({
    ...row,
    image_url: row.image_url ? JSON.parse(row.image_url) : [],
    specifications: row.specifications ? JSON.parse(row.specifications) : null,
  })) as ProductVariant[];
}


export async function updateVariant(
  id: string,
  data: Partial<ProductVariant>,
  newImageFiles?: Express.Multer.File[]
): Promise<ProductVariant> {
  const [rows] = await pool.query("SELECT * FROM product_variants WHERE id = ?", [id]);
  const variant = (rows as any[])[0];
  if (!variant) throw new Error("Variant not found");

  if (data.stock !== undefined) {
    await checkStockAvailability(variant.product_id, data.stock, id);
  }


  let oldImages: string[] = [];
  let newUploadedImages: string[] = [];
  if (variant.image_url) oldImages = JSON.parse(variant.image_url); // parse JSON string
  try {
    if (newImageFiles && newImageFiles.length > 0) {
      if (variant.image_url) oldImages = variant.image_url; // already array

      for (const file of newImageFiles) {
        const url = await uploadToCloudinary(file.buffer, "variants");
        newUploadedImages.push(url);
      }

      data.image_url = JSON.stringify(newUploadedImages);
    }

    const fields: string[] = [];
    const values: any[] = [];

    for (const key in data) {
      if (key !== "id") {
        fields.push(`${key} = ?`);
        if (key === "specifications" && data[key]) {
          values.push(typeof data[key] === "object" ? JSON.stringify(data[key]) : data[key]);
        } else {
          values.push((data as any)[key]);
        }
      }
    }

    if (fields.length > 0) {
      values.push(id);
      await pool.query(`UPDATE product_variants SET ${fields.join(", ")} WHERE id = ?`, values);
    }

    // Delete old images if replaced
    if (oldImages.length > 0) {
      for (const url of oldImages) {
        const publicId = getPublicIdFromUrl(url);
        await deleteFromCloudinary(publicId).catch((e) => console.error("Failed to delete old image:", publicId, e));
      }
    }

    return { ...variant, ...data };
  } catch (err) {
    if (newUploadedImages.length > 0) {
      for (const url of newUploadedImages) {
        const publicId = getPublicIdFromUrl(url);
        await deleteFromCloudinary(publicId).catch((e) => console.error("Rollback failed for image:", publicId, e));
      }
    }
    throw err;
  }
}


export async function deleteVariant(id: string) {
  const [rows] = await pool.query(
    "SELECT * FROM product_variants WHERE id = ?",
    [id]
  );

  const variant = (rows as any[])[0];
  if (!variant) throw new Error("Variant not found");


  if (variant.image_url && Array.isArray(variant.image_url)) {
    for (const url of variant.image_url) {
      const publicId = getPublicIdFromUrl(url);
      await deleteFromCloudinary(publicId).catch((e) =>
        console.error("Failed to delete image:", publicId, e)
      );
    }
  }

  await pool.query("DELETE FROM product_variants WHERE id = ?", [id]);

  return {
    success: true,
    message: "Variant and images deleted successfully",
  };
}

export async function createBulkVariants(variantsData: ProductVariant[]): Promise<any> {
  if (!variantsData || variantsData.length === 0) {
    throw new Error("No variants provided for bulk insert");
  }

  const values: any[][] = [];
  const newVariants: ProductVariant[] = [];

  // Group by product_id to validate stock in one go per product or multiple checks
  const productStockMap = new Map<string, number>();
  for (const v of variantsData) {
    productStockMap.set(v.product_id, (productStockMap.get(v.product_id) || 0) + (v.stock || 0));
  }

  for (const [productId, additionalStock] of productStockMap.entries()) {
    await checkStockAvailability(productId, additionalStock);
  }

  for (const variant of variantsData) {
    const id = generateUUID();
    const {
      product_id,
      price,
      sku,
      stock,
      image_url,
      is_default,
      is_active,
      specifications,
    } = variant;


    if (!product_id) {
      throw new Error("Missing required fields (product_id) for one or more variants");
    }


    values.push([
      id,
      product_id,
      price || 0,
      sku || null,
      stock || 0,
      image_url ? (Array.isArray(image_url) ? JSON.stringify(image_url) : image_url) : null,
      is_default ?? false,
      is_active ?? true,
      specifications ? JSON.stringify(specifications) : null,
    ]);


    newVariants.push({
      ...variant,
      id,
    });
  }

  const sql = `
    INSERT INTO product_variants
      (id, product_id, price, sku, stock, image_url, is_default, is_active, specifications)
    VALUES ?
  `;


  await pool.query(sql, [values]);

  return {
    success: true,
    message: `Successfully inserted ${newVariants.length} variants`,
    insertedCount: newVariants.length,
    variants: newVariants,
  };
}