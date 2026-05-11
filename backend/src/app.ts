import express from "express";
import { checkDatabaseConnection } from "./database/health";
import { env } from "./config/env";
import categoryRoutes from "./modules/category/category.routes";
import variantRoutes from "./modules/variants/variants.routes"
import productRoute from "./modules/products/product.routes";
import orderRoute from "./modules/orders/orders.routes"
import authRoutes from "./modules/auth/auth.routes"
import cookieParser from "cookie-parser";
import productSuggestRoutes from "./modules/aiProductSearch/RapidApi/amazon.routes"
import reviewRoutes from "./modules/reviews/reviews.routes";
import templateRoutes from "./modules/templates/templates.routes";
import analyticsRoutes from "./modules/analytics/analytics.routes";
import promotionsRoutes from "./modules/promotions/promotions.routes";
import logsRoutes from "./modules/logs/logs.routes";
import contactsRoutes from "./modules/contacts/contacts.routes";
import subscriptionsRoutes from "./modules/subscriptions/subscriptions.routes";
import { pool } from "./config/db";
import { logMiddleware } from "./utils/logs";
import cors from "cors";
import { globalErrorHandler } from "./utils/errors";
import { authenticateToken } from "./modules/auth/auth.middleware";
import { authorizeAdmin } from "./modules/auth/admin.middleware";
import "./notifications/workers/emailWorker";
const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-api-key", "Accept"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(logMiddleware(pool));
app.use("/auth", authRoutes);
app.use("/categories", categoryRoutes);
app.use("/products", productRoute);
app.use("/variants", variantRoutes);
app.use("/orders", orderRoute);
app.use("/amazon", productSuggestRoutes);
app.use("/reviews", reviewRoutes);
app.use("/templates", templateRoutes);
app.use("/analytics", authenticateToken, authorizeAdmin, analyticsRoutes);
app.use("/promotions", promotionsRoutes);
app.use("/logs", authenticateToken, authorizeAdmin, logsRoutes);
app.use("/contacts", contactsRoutes);
app.use("/subscriptions", subscriptionsRoutes);

app.get("/", (_req, res) => {
  res.send("Hey Abdullah, the server is running 🚀");
  console.log("The server is running");
});

// Global Error Handler - must be at the end
app.use(globalErrorHandler);

export const startServer = async () => {
  const isConnected = await checkDatabaseConnection();
  if (!isConnected) {
    console.error("Failed to start server due to database connection issues.");
    process.exit(1);
  }

  app.listen(env.PORT, () => {
    console.log(`Server is running on port ${env.PORT}`);
  });
};

export default app;

if (process.env.NODE_ENV !== "test") {
  startServer();
}