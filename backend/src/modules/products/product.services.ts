import { pool } from "../../config/db";
import { Product } from "./product.model";
import { generateUUID } from "../../utils/uuui";
import { getPublicIdFromUrl } from "../../utils/fileHandling";
import { uploadToCloudinary, deleteFromCloudinary, } from "../../utils/fileHandling";
import { ProductFilters } from "./product.model";

const safeJsonParse = (data: any, fallback: any = []) => {
  if (!data) return fallback;
  if (typeof data === 'object') return data;
  try {
    return JSON.parse(data);
  } catch (e) {
    if (typeof data === 'string' && data.startsWith('http') && Array.isArray(fallback)) {
      return [data];
    }
    return fallback;
  }
};


export async function getAllProducts(
  page: number = 1,
  limit: number = 20
): Promise<{
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
}> {
  const offset = (page - 1) * limit;


  const [countResult] = await pool.query(
    "SELECT COUNT(*) as total FROM products"
  );
  const total = (countResult as any)[0].total;
  const totalPages = Math.ceil(total / limit);


  const [rows] = await pool.query(
    `
    SELECT 
      id, category_id, title, description, page_handle, 
      images, tags, meta_title, meta_description, meta_keywords, 
      price, total_stock, is_active, specifications, created_at, updated_at 
    FROM products 
    WHERE 1=1
    ORDER BY created_at DESC
    LIMIT ? OFFSET ?
    `,
    [limit, offset]
  );


  const products = rows as Product[];

  return {
    products,
    total,
    page,
    totalPages,
  };
}

export async function getProductBySlug(slug: string): Promise<Product | null> {

  const [productRows] = await pool.query(
    `SELECT * FROM products WHERE page_handle = ? LIMIT 1`,
    [slug]
  );

  if ((productRows as any[]).length === 0) return null;

  const product = (productRows as any[])[0];


  const [variantRows] = await pool.query(
    `SELECT * FROM product_variants WHERE product_id = ? ORDER BY is_default DESC, id ASC`,
    [product.id]
  );

  const variants = (variantRows as any[]).map(variant => {
    const specifications = safeJsonParse(variant.specifications, null);
    
    // Dynamic Title Synthesis: Product Title + [Attr1 / Attr2]
    const specValues = specifications ? Object.values(specifications).filter(v => v).join(" / ") : "";
    const full_title = specValues ? `${product.title} [${specValues}]` : product.title;

    return {
      ...variant,
      full_title,
      image_url: safeJsonParse(variant.image_url),
      specifications,
    };
  });



  const defaultVariant = variants.find(v => v.is_default === 1) || variants[0] || null;
  const otherVariants = variants.filter(v => v !== defaultVariant);


  const images = safeJsonParse(product.images);


  const [reviewRows] = await pool.query(
    `SELECT r.*, u.name as user_name FROM reviews r LEFT JOIN users u ON r.user_id = u.id WHERE r.product_id = ? ORDER BY r.created_at DESC`,
    [product.id]
  );

  return {
    ...product,
    specifications: safeJsonParse(product.specifications, null),

    images,
    variants: otherVariants,
    defaultVariant,
    reviews: reviewRows || [],
  };
}


export async function getProductById(id: string): Promise<Product | null> {
  const [rows] = await pool.query("SELECT * FROM products WHERE id = ?", [id]);
  return (rows as any[])[0] || null;
}


export async function getProductByCategory(
  category_id: string,
  page: number,
  limit: number
): Promise<Product[]> {
  const offset = (page - 1) * limit;

  const [rows] = await pool.query(
    "SELECT * FROM products WHERE category_id = ? LIMIT ?, ?",
    [category_id, offset, limit]
  );

  return rows as Product[];
}

export async function getNewProducts(limit: number = 10): Promise<Product[]> {
  const [rows] = await pool.query(
    `SELECT *
       FROM products
       WHERE 1=1
       ORDER BY created_at DESC
       LIMIT ?`,
    [limit]
  );

  return (rows as any[]).map(product => ({
    ...product,
    images: safeJsonParse(product.images),

  }));
}

export async function getFeaturedProducts(limit: number = 10): Promise<Product[]> {
  const [rows] = await pool.query(
    `SELECT * FROM products WHERE is_featured = 1 ORDER BY created_at DESC LIMIT ?`,
    [limit]
  );

  return (rows as any[]).map(product => ({
    ...product,
    images: safeJsonParse(product.images),

  }));
}


export async function searchProducts(query: string, limit: number = 20, page: number = 1): Promise<Product[]> {
  const offset = (page - 1) * limit;

  const sql = `
      SELECT *
      FROM products
      WHERE (title LIKE ?)
      LIMIT ?, ?
    `;
  const values = [`%${query}%`, offset, limit];

  const [rows] = await pool.query(sql, values);

  return rows as Product[];
}

export async function createProduct(
  productData: Product,
  imageFiles?: Express.Multer.File[]
): Promise<Product> {
  const {
    category_id,
    description,
    tags,
    meta_title,
    meta_description,
    meta_keywords,
    price,
    total_stock,
    is_active,
    specifications,
  } = productData;

  const title = productData.title || (productData as any).name;
  const page_handle = productData.page_handle || (productData as any).slug;


  const [categoryRows] = await pool.query(
    "SELECT id FROM categories WHERE id = ?",
    [category_id]
  );

  if ((categoryRows as any[]).length === 0) {
    throw new Error("Category not found");
  }

  const [existing] = await pool.query("SELECT id FROM products WHERE page_handle = ?", [page_handle]);
  if ((existing as any[]).length > 0) {
    throw new Error("Product page_handle already exists");
  }

  let uploadedImages: string[] = [];

  try {

    if (imageFiles && imageFiles.length > 0) {
      for (const file of imageFiles) {
        const url = await uploadToCloudinary(file.buffer, "products");
        uploadedImages.push(url);
      }
    }


    const id = generateUUID();

    await pool.query(
      `INSERT INTO products
         (id, category_id, title, description, page_handle, images, tags, meta_title, meta_description, meta_keywords, price, total_stock, is_active, specifications)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        category_id,
        title,
        description || null,
        page_handle,
        uploadedImages.length > 0 ? JSON.stringify(uploadedImages) : null,
        tags ? JSON.stringify(tags) : null,
        meta_title || null,
        meta_description || null,
        meta_keywords ? JSON.stringify(meta_keywords) : null,
        price,
        total_stock,
        is_active ?? true,
        specifications ? JSON.stringify(specifications) : null,
      ]
    );


    return {
      id,
      category_id,
      title,
      description: description || null,
      page_handle,
      images: uploadedImages,
      tags: tags || null,
      meta_title: meta_title || null,
      meta_description: meta_description || null,
      meta_keywords: meta_keywords || null,
      price,
      total_stock,
      is_active: is_active ?? true,
      specifications: specifications || null,
    };
  } catch (err) {

    if (uploadedImages.length > 0) {
      for (const url of uploadedImages) {
        const publicId = getPublicIdFromUrl(url);
        await deleteFromCloudinary(publicId).catch((e) => console.error("Rollback failed for image:", publicId, e));
      }
    }
    throw err;
  }
}

export async function updateProduct(
  id: string,
  data: Partial<Product>,
  newImageFiles?: Express.Multer.File[]
): Promise<Product> {
  const [rows] = await pool.query("SELECT * FROM products WHERE id = ?", [id]);
  const product = (rows as any[])[0];
  if (!product) throw new Error("Product not found");

  if (data.total_stock !== undefined) {
    const [variantSumRows] = await pool.query(
      "SELECT SUM(stock) as total FROM product_variants WHERE product_id = ?",
      [id]
    );
    const currentVariantStock = Number((variantSumRows as any)[0].total || 0);

    if (data.total_stock < currentVariantStock) {
      throw new Error(
        `New product total stock (${data.total_stock}) cannot be less than the current total variant stock (${currentVariantStock})`
      );
    }
  }

  let oldImages: string[] = [];
  let newUploadedImages: string[] = [];

  try {

    if (newImageFiles && newImageFiles.length > 0) {

      if (product.images) oldImages = safeJsonParse(product.images);



      for (const file of newImageFiles) {
        const url = await uploadToCloudinary(file.buffer, "products");
        newUploadedImages.push(url);
      }


      data.images = newUploadedImages;
    }


    const fields: string[] = [];
    const values: any[] = [];

    // Mapping name -> title and slug -> page_handle if they exist in the payload
    const mappedData: any = { ...data };
    if (mappedData.name) {
        mappedData.title = mappedData.name;
        delete mappedData.name;
    }
    if (mappedData.slug) {
        mappedData.page_handle = mappedData.slug;
        delete mappedData.slug;
    }

    const allowedColumns = [
        "category_id", "title", "description", "page_handle", 
        "images", "tags", "meta_title", "meta_description", "meta_keywords", 
        "price", "total_stock", "is_active", "specifications"
    ];

    for (const key in mappedData) {
      if (key !== "id" && allowedColumns.includes(key)) {
        fields.push(`${key} = ?`);
        if (key === "images" && Array.isArray(mappedData[key])) {
          values.push(JSON.stringify(mappedData[key]));
        } else if ((key === "tags" || key === "meta_keywords" || key === "specifications") && mappedData[key]) {
          values.push(typeof mappedData[key] === "object" ? JSON.stringify(mappedData[key]) : mappedData[key]);
        } else {
          values.push(mappedData[key]);
        }
      }
    }


    if (fields.length > 0) {
      values.push(id);
      await pool.query(`UPDATE products SET ${fields.join(", ")} WHERE id = ?`, values);
    }


    if (oldImages.length > 0) {
      for (const url of oldImages) {
        const publicId = getPublicIdFromUrl(url);
        await deleteFromCloudinary(publicId).catch((e) => console.error("Failed to delete old image:", publicId, e));
      }
    }

    return { ...product, ...data };
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


export async function deleteProduct(id: string) {

  const product = await getProductById(id);
  if (!product) throw new Error("Product not found");


  if (product.images && product.images.length > 0) {

    const imageUrl = product.images[0];
    const parts = imageUrl.split("/");
    const filename = parts[parts.length - 1];
    const publicId = `products/${filename.split(".")[0]}`;

    await deleteFromCloudinary(publicId).catch((e) =>
      console.error("Failed to delete product image:", publicId, e)
    );
  }


  await pool.query("DELETE FROM products WHERE id = ?", [id]);

  return { success: true, message: "Product and image deleted successfully" };
}


export async function filterProducts(filters: ProductFilters): Promise<Product[]> {
  const { categoryIds, tags, minPrice, maxPrice, sortBy, search } = filters;

  let query = `SELECT * FROM products WHERE 1=1`;
  const values: any[] = [];


  if (categoryIds && categoryIds.length > 0) {
    query += ` AND category_id IN (${categoryIds.map(() => "?").join(",")})`;
    values.push(...categoryIds);
  }


  if (tags && tags.length > 0) {
    tags.forEach(tag => {
      query += ` AND JSON_CONTAINS(tags, ?)`;
      values.push(`"${tag}"`);
    });
  }


  if (minPrice !== undefined) {
    query += ` AND price >= ?`;
    values.push(minPrice);
  }
  if (maxPrice !== undefined) {
    query += ` AND price <= ?`;
    values.push(maxPrice);
  }


  if (search) {
    query += ` AND (title LIKE ? OR description LIKE ?)`;
    values.push(`%${search}%`, `%${search}%`);
  }


  if (sortBy === "newest") {
    query += ` ORDER BY created_at DESC`;
  } else if (sortBy === "popular") {
    query += ` ORDER BY popularity DESC`;
  } else if (sortBy === "price_low") {
    query += ` ORDER BY price ASC`;
  } else if (sortBy === "price_high") {
    query += ` ORDER BY price DESC`;
  } else {
    query += ` ORDER BY created_at DESC`;
  }

  const [rows] = await pool.query(query, values);

  return (rows as any[]).map(product => ({
    ...product,

    tags: safeJsonParse(product.tags),
    specifications: safeJsonParse(product.specifications, null),

  }));
}

export async function createBulkProducts(productsData: Product[]): Promise<any> {
  if (!productsData || productsData.length === 0) {
    throw new Error("No products provided for bulk insert");
  }

  // Pre-process and validate
  const values: any[][] = [];
  const newProducts: Product[] = [];

  for (const product of productsData) {
    const id = generateUUID();
    const {
      category_id,
      title,
      description,
      page_handle,
      images,
      tags,
      meta_title,
      meta_description,
      meta_keywords,
      price,
      total_stock,
      is_active,
      specifications,
    } = product;

    if (!category_id || !title || !page_handle) {
       throw new Error("Missing required fields for one or more products");
    }

    values.push([
      id,
      category_id,
      title,
      description || null,
      page_handle,
      images ? JSON.stringify(images) : null,
      tags ? JSON.stringify(tags) : null,
      meta_title || null,
      meta_description || null,
      meta_keywords ? JSON.stringify(meta_keywords) : null,
      price || 0,
      total_stock || 0,
      is_active ?? true,
      specifications ? JSON.stringify(specifications) : null,
    ]);

    newProducts.push({
      ...product,
      id,
    });
  }

  const sql = `
    INSERT INTO products
      (id, category_id, title, description, page_handle, images, tags, meta_title, meta_description, meta_keywords, price, total_stock, is_active, specifications)
    VALUES ?
  `;


  await pool.query(sql, [values]);

  return {
    success: true,
    message: `Successfully inserted ${newProducts.length} products`,
    insertedCount: newProducts.length,
    products: newProducts,
  };
}
