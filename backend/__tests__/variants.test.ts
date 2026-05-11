import request from "supertest";
import app from "../src/app";
import * as variantService from "../src/modules/variants/variants.services";

jest.mock("../src/modules/variants/variants.services");

describe("Variants API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /variants", () => {
    it("should create a variant and return 201", async () => {
      const mockVariant = { id: "1", product_id: "p1", color: "Red" };
      (variantService.createVariant as jest.Mock).mockResolvedValue(mockVariant);

      const res = await request(app).post("/variants").send({ product_id: "p1", color: "Red" });
      expect(res.status).toBe(201);
      expect(res.body).toEqual(mockVariant);
    });

    it("should return 500 on creation error", async () => {
      (variantService.createVariant as jest.Mock).mockRejectedValue(new Error("DB Error"));

      const res = await request(app).post("/variants").send({ color: "Blue" });
      expect(res.status).toBe(500);
      expect(res.body.message).toBe("Failed to create variant");
    });
  });

  describe("GET /variants/:product_id", () => {
    it("should return variants for a product", async () => {
      const mockVariants = [{ id: "1", color: "Red" }];
      (variantService.getVariantsByProduct as jest.Mock).mockResolvedValue(mockVariants);

      const res = await request(app).get("/variants/p1");
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual(mockVariants);
    });
  });

  describe("PUT /variants/:id", () => {
    it("should update variant and return 200", async () => {
      const updatedVariant = { id: "1", color: "Blue" };
      (variantService.updateVariant as jest.Mock).mockResolvedValue(updatedVariant);

      const res = await request(app).put("/variants/1").send({ color: "Blue" });
      expect(res.status).toBe(200);
      expect(res.body).toEqual(updatedVariant);
    });
  });

  describe("DELETE /variants/:id", () => {
    it("should delete variant and return 200", async () => {
      const mockResult = { success: true };
      (variantService.deleteVariant as jest.Mock).mockResolvedValue(mockResult);

      const res = await request(app).delete("/variants/1");
      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockResult);
    });
  });
});
