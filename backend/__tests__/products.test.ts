import request from "supertest";
import app from "../src/app";
import * as productService from "../src/modules/products/product.services";

// Mock the services
jest.mock("../src/modules/products/product.services");

describe("Product API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /products", () => {
    it("should return a list of products", async () => {
      const mockResult = { products: [{ id: "1", title: "Test Product" }], total: 1 };
      (productService.getAllProducts as jest.Mock).mockResolvedValue(mockResult);

      const res = await request(app).get("/products");
      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockResult);
    });
  });

  describe("GET /products/:page_handle", () => {
    it("should return 404 if product not found", async () => {
      (productService.getProductBySlug as jest.Mock).mockResolvedValue(null);

      const res = await request(app).get("/products/nonexistent");
      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Product not found");
    });

    it("should return the product if found", async () => {
      const mockProduct = { id: "1", page_handle: "test-product" };
      (productService.getProductBySlug as jest.Mock).mockResolvedValue(mockProduct);

      const res = await request(app).get("/products/test-product");
      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockProduct);
    });
  });

  describe("GET /products/category", () => {
    it("should return 400 if category_id not provided", async () => {
      const res = await request(app).get("/products/category");
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("category_id is required");
    });

    it("should return products for category", async () => {
      const mockProducts = [{ id: "1", category_id: "cat1" }];
      (productService.getProductByCategory as jest.Mock).mockResolvedValue(mockProducts);

      const res = await request(app).get("/products/category?category_id=cat1");
      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockProducts);
    });
  });

  describe("GET /products/search", () => {
    it("should return 400 if search query is missing", async () => {
      const res = await request(app).get("/products/search");
      expect(res.status).toBe(400);
    });

    it("should return search results", async () => {
      const mockProducts = [{ id: "1", title: "Search Match" }];
      (productService.searchProducts as jest.Mock).mockResolvedValue(mockProducts);

      const res = await request(app).get("/products/search?query=Match");
      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockProducts);
    });
  });

  describe("POST /products", () => {
    it("should create a product and return 201", async () => {
      const newProduct = { id: "2", title: "New Product" };
      (productService.createProduct as jest.Mock).mockResolvedValue(newProduct);

      const res = await request(app).post("/products").send({ title: "New Product" });
      expect(res.status).toBe(201);
      expect(res.body).toEqual(newProduct);
    });
  });

  describe("PUT /products/:id", () => {
    it("should update a product and return 200", async () => {
      const updatedProduct = { id: "2", title: "Updated Product" };
      (productService.updateProduct as jest.Mock).mockResolvedValue(updatedProduct);

      const res = await request(app).put("/products/2").send({ title: "Updated Product" });
      expect(res.status).toBe(200);
      expect(res.body).toEqual(updatedProduct);
    });
  });

  describe("DELETE /products/:id", () => {
    it("should delete a product and return 200", async () => {
      (productService.deleteProduct as jest.Mock).mockResolvedValue({ success: true, message: "Product and image deleted successfully" });

      const res = await request(app).delete("/products/2");
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ success: true, message: "Product and image deleted successfully" });
    });
  });
});
