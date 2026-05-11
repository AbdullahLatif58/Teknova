import request from "supertest";
import app from "../src/app";
import * as categoryService from "../src/modules/category/category.services";

jest.mock("../src/modules/category/category.services");

describe("Category API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /categories", () => {
    it("should return a list of categories", async () => {
      const mockCategories = [{ id: "1", name: "Electronics", slug: "electronics" }];
      (categoryService.getAllCategory as jest.Mock).mockResolvedValue(mockCategories);

      const res = await request(app).get("/categories");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual(mockCategories);
    });

    it("should return 500 on service error", async () => {
      (categoryService.getAllCategory as jest.Mock).mockRejectedValue(new Error("DB Error"));

      const res = await request(app).get("/categories");

      expect(res.status).toBe(500);
      expect(res.body.success).toBe(false);
    });
  });

  describe("GET /categories/:slug", () => {
    it("should return 404 if category not found", async () => {
      (categoryService.getBySlug as jest.Mock).mockResolvedValue(null);

      const res = await request(app).get("/categories/not-found");

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Category not found");
    });

    it("should return category if found", async () => {
      const mockCategory = { id: "1", name: "Electronics", slug: "electronics" };
      (categoryService.getBySlug as jest.Mock).mockResolvedValue(mockCategory);

      const res = await request(app).get("/categories/electronics");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual(mockCategory);
    });
  });

  describe("POST /categories", () => {
    it("should create a category and return 201", async () => {
      const newCategory = { id: "2", name: "Fashion", slug: "fashion" };
      (categoryService.createCategory as jest.Mock).mockResolvedValue(newCategory);

      const res = await request(app).post("/categories").send({
        name: "Fashion",
        description: "Clothing and apparel",
      });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual(newCategory);
      expect(categoryService.createCategory).toHaveBeenCalled();
    });

    it("should return 400 on creation error", async () => {
      (categoryService.createCategory as jest.Mock).mockRejectedValue(new Error("Slug already exists"));

      const res = await request(app).post("/categories").send({
        name: "Fashion",
      });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Slug already exists");
    });
  });

  describe("PUT /categories/:id", () => {
    it("should update and return 200", async () => {
      const updatedCategory = { id: "1", name: "Updated Electronics" };
      (categoryService.updateCategoryService as jest.Mock).mockResolvedValue(updatedCategory);

      const res = await request(app).put("/categories/1").send({
        name: "Updated Electronics",
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual(updatedCategory);
    });
  });

  describe("DELETE /categories/:id", () => {
    it("should delete category and return 200", async () => {
      (categoryService.deleteCategoryService as jest.Mock).mockResolvedValue(true);

      const res = await request(app).delete("/categories/1");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("Category deleted successfully");
    });
  });
});
