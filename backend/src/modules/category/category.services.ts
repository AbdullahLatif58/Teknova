import { pool } from "../../config/db";
import { Category } from "./category.model";
import { generateUUID } from "../../utils/uuui";
import { getPublicIdFromUrl } from "../../utils/fileHandling";
import { uploadToCloudinary, deleteFromCloudinary, } from "../../utils/fileHandling";

export async function getAllCategory(): Promise<Category[]> {
  const [rows] = await pool.query("SELECT * FROM categories");

  return rows as Category[];


}

export async function getCategoryById(id: string): Promise<Category | null> {
  const [rows] = await pool.execute(
    "SELECT * FROM categories WHERE id = ?",
    [id]
  );

  return (rows as Category[])[0] || null;
}


export async function getBySlug(slug: string): Promise<Category | null> {
  const [rows] = await pool.query(
    "SELECT * FROM categories WHERE slug = ?",
    [slug]
  );
  return (rows as Category[])[0];
}


export async function createCategory(category: Category, imageFile?: Express.Multer.File) {
  const {
    name,
    slug,
    description,
    is_active,
    meta_title,
    meta_description,
    meta_keywords,
  } = category;

  const [existingSlug] = await pool.query("SELECT id FROM categories WHERE slug = ?", [slug]);
  if ((existingSlug as any[]).length > 0) {
    throw new Error("Slug already exists");
  }


  let imageUrl: string | null = null;
  try {
    if (imageFile) {
      imageUrl = await uploadToCloudinary(imageFile.buffer, "categories");
    }

    const id = generateUUID();
    await pool.query(
      `INSERT INTO categories
       (id, name, slug, description, is_active, meta_title, meta_description, meta_keywords, image_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        name,
        slug,
        description || null,
        is_active ?? true,
        meta_title || null,
        meta_description || null,
        meta_keywords || null,
        imageUrl,
      ]
    );

    return {
      id,
      ...category,
      image_url: imageUrl,
    };
  } catch (err) {

    if (imageUrl) {
      const publicId = imageUrl.split("/").slice(-2).join("/").split(".")[0]; // folder/filename
      await deleteFromCloudinary(publicId);
    }
    throw err;
  }
}




export async function updateCategoryService(
  id: string,
  data: Partial<Category>,
  newImageFiles?: Express.Multer.File[]
) {
  const category = await getCategoryById(id);
  if (!category) throw new Error("Category not found");

  let newImageUrl: string | undefined;
  let oldPublicId: string | undefined;

  try {
    if (newImageFiles && newImageFiles.length > 0) {
      const file = newImageFiles[0];


      newImageUrl = await uploadToCloudinary(file.buffer, "categories");
      data.image_url = newImageUrl;


      if (category.image_url) {
        oldPublicId = getPublicIdFromUrl(category.image_url);
      }
    }


    const fields: string[] = [];
    const values: any[] = [];
    for (const key in data) {
      if (key !== "id") {
        fields.push(`${key} = ?`);
        values.push((data as any)[key]);
      }
    }

    if (fields.length > 0) {
      values.push(id);
      await pool.query(`UPDATE categories SET ${fields.join(", ")} WHERE id = ?`, values);
    }


    if (oldPublicId) {
      deleteFromCloudinary(oldPublicId).catch(err => console.error("Failed to delete old image:", err));
    }

    return { ...category, ...data };
  } catch (err) {

    if (newImageUrl) {
      const publicId = getPublicIdFromUrl(newImageUrl);
      await deleteFromCloudinary(publicId).catch(e => console.error("Failed to rollback new image:", e));
    }
    throw err;
  }
}



export async function deleteCategoryService(id: string) {
  if (!id) {
    throw new Error("ID is required");
  }


  const category = await getCategoryById(id);
  if (!category) {
    throw new Error("Category not found");
  }


  if (category.image_url) {
    const parts = category.image_url.split("/");
    const filename = parts[parts.length - 1];
    const publicId = `categories/${filename.split(".")[0]}`;
    await deleteFromCloudinary(publicId);
  }


  await pool.execute(
    "DELETE FROM categories WHERE id = ?",
    [id]
  );

  return {
    success: true,
    message: "Category deleted successfully",
  };
}

export async function createBulkCategories(categoriesData: Category[]): Promise<any> {
  if (!categoriesData || categoriesData.length === 0) {
    throw new Error("No categories provided for bulk insert");
  }

  const values: any[][] = [];
  const newCategories: Category[] = [];

  for (const category of categoriesData) {
    const id = generateUUID();
    const {
      name,
      slug,
      description,
      is_active,
      meta_title,
      meta_description,
      meta_keywords,
    } = category;

    if (!name || !slug) {
      throw new Error("Missing required fields (name, slug) for one or more categories");
    }

    values.push([
      id,
      name,
      slug,
      description || null,
      is_active ?? true,
      meta_title || null,
      meta_description || null,
      meta_keywords ? JSON.stringify(meta_keywords) : null,
      null, // image_url
    ]);

    newCategories.push({
      ...category,
      id,
    });
  }

  const sql = `
    INSERT INTO categories
      (id, name, slug, description, is_active, meta_title, meta_description, meta_keywords, image_url)
    VALUES ?
  `;

  await pool.query(sql, [values]);

  return {
    success: true,
    message: `Successfully inserted ${newCategories.length} categories`,
    insertedCount: newCategories.length,
    categories: newCategories,
  };
}


