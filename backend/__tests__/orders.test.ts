import request from "supertest";
import app from "../src/app";
import * as ordersService from "../src/modules/orders/orders.services";

jest.mock("../src/modules/orders/orders.services");

describe("Orders API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /orders", () => {
    it("should return a list of orders", async () => {
      const mockOrders = [{ id: 1, user_id: 1, total_price: 100 }];
      (ordersService.getOrders as jest.Mock).mockResolvedValue(mockOrders);

      const res = await request(app).get("/orders");
      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockOrders);
    });
  });

  describe("GET /orders/:id", () => {
    it("should return 404 if order not found", async () => {
      (ordersService.getOrderById as jest.Mock).mockResolvedValue(null);

      const res = await request(app).get("/orders/999");
      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Order not found");
    });

    it("should return order if found", async () => {
      const mockOrder = { id: 1, user_id: 1, total_price: 100 };
      (ordersService.getOrderById as jest.Mock).mockResolvedValue(mockOrder);

      const res = await request(app).get("/orders/1");
      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockOrder);
    });
  });

  describe("POST /orders", () => {
    it("should return 400 if items array is missing", async () => {
      const res = await request(app).post("/orders").send({ user_id: 1 });
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("items array is required");
    });

    it("should create order and return 201", async () => {
      (ordersService.createOrder as jest.Mock).mockResolvedValue(1);

      const res = await request(app).post("/orders").send({
        user_id: 1,
        items: [{ variant_id: "v1", quantity: 2 }]
      });

      expect(res.status).toBe(201);
      expect(res.body.order_id).toBe(1);
    });
  });

  describe("PUT /orders/:id/status", () => {
    it("should update order status", async () => {
      (ordersService.updateOrderStatus as jest.Mock).mockResolvedValue(undefined);

      const res = await request(app).put("/orders/1/status").send({ status: "Shipped" });
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Order status updated");
    });
  });

  describe("PUT /orders/:id/cancel", () => {
    it("should cancel order", async () => {
      (ordersService.cancelOrder as jest.Mock).mockResolvedValue(undefined);

      const res = await request(app).put("/orders/1/cancel");
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Order cancelled & stock restored");
    });
  });
});
