import request from "supertest";
import app from "../src/app";
import * as amazonSearch from "../src/modules/aiProductSearch/RapidApi/amazon.search";

jest.mock("../src/modules/aiProductSearch/RapidApi/amazon.search");

describe("Amazon Search API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /amazon/search-with-details", () => {
    it("should return 400 if query is missing", async () => {
      const res = await request(app).get("/amazon/search-with-details");
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Missing query parameter ?q=your+product");
    });

    it("should return 502 if search fails", async () => {
      (amazonSearch.searchProducts as jest.Mock).mockResolvedValue({
        success: false,
        error: "RapidAPI down"
      });

      const res = await request(app).get("/amazon/search-with-details?q=laptop");
      expect(res.status).toBe(502);
      expect(res.body.success).toBe(false);
    });

    it("should return detailed products successfully", async () => {
      (amazonSearch.searchProducts as jest.Mock).mockResolvedValue({
        success: true,
        data: [{ asin: "B000123" }]
      });

      (amazonSearch.getProductDetails as jest.Mock).mockResolvedValue({
        success: true,
        data: { asin: "B000123", title: "Mock Laptop Details" }
      });

      const res = await request(app).get("/amazon/search-with-details?q=laptop");
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].title).toBe("Mock Laptop Details");
    });
  });
});
