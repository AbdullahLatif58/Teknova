import { Request, Response } from "express";
import {
    createOrder,
    getOrders,
    getOrderById,
    updateOrderStatus,
    cancelOrder,
} from "./orders.services";
import { asyncHandler, AppError } from "../../utils/errors";

export const createOrderController = asyncHandler(async (req: Request, res: Response) => {
    const data = req.body;

    const orderId = await createOrder(data);
    res.status(201).json({ success: true, order_id: orderId });
});

export const getOrdersController = asyncHandler(async (req: Request, res: Response) => {
    const orders = await getOrders();
    res.json({ success: true, data: orders });
});

export const getOrderByIdController = asyncHandler(async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const order = await getOrderById(id);
    if (!order) throw new AppError("Order not found", 404, "ORDER_NOT_FOUND");
    res.json({ success: true, data: order });
});

export const updateOrderStatusController = asyncHandler(async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    if (!id) throw new AppError("Invalid order ID", 400, "INVALID_PARAMETER");

    await updateOrderStatus(id, req.body.status);
    res.json({ success: true, message: "Order status updated" });
});

export const cancelOrderController = asyncHandler(async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    if (!id) throw new AppError("Invalid order ID", 400, "INVALID_PARAMETER");

    await cancelOrder(id);
    res.json({ success: true, message: "Order cancelled & stock restored" });
});