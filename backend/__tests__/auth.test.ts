import request from "supertest";
import app from "../src/app";
import * as authService from "../src/modules/auth/auth.services";
import { addEmailToQueue } from "../src/notifications/queues/emailQueue";


jest.mock("../src/modules/auth/auth.services");
jest.mock("../src/notifications/queues/emailQueue");

describe("Auth API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /auth/signup", () => {
    it("should return 400 if fields are missing", async () => {
      const res = await request(app).post("/auth/signup").send({});
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("name, email, and password are required");
    });

    it("should return 409 if email already exists", async () => {
      (authService.getUserByEmail as jest.Mock).mockResolvedValue({ id: 1, email: "test@example.com" });

      const res = await request(app).post("/auth/signup").send({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      });

      expect(res.status).toBe(409);
      expect(res.body.message).toBe("Email already exists");
    });

    it("should create user and return 201", async () => {
      (authService.getUserByEmail as jest.Mock).mockResolvedValue(null);
      (authService.createUser as jest.Mock).mockResolvedValue(1);

      const res = await request(app).post("/auth/signup").send({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      });

      expect(res.status).toBe(201);
      expect(res.body.message).toBe("User created");
      expect(authService.createUser).toHaveBeenCalled();
      expect(addEmailToQueue).toHaveBeenCalled();
    });
  });

  describe("POST /auth/login", () => {
    it("should return 400 if email or password missing", async () => {
      const res = await request(app).post("/auth/login").send({ email: "test@example.com" });
      expect(res.status).toBe(400);
    });

    it("should return 401 for invalid credentials (user not found)", async () => {
      (authService.getUserByEmail as jest.Mock).mockResolvedValue(null);

      const res = await request(app).post("/auth/login").send({
        email: "nonexistent@example.com",
        password: "password123",
      });

      expect(res.status).toBe(401);
    });
  });

  describe("GET /auth/users", () => {
    it("should return list of users", async () => {
      const mockUsers = [{ id: 1, name: "User1" }, { id: 2, name: "User2" }];
      (authService.getAllUsers as jest.Mock).mockResolvedValue(mockUsers);

      const res = await request(app).get("/auth/users");
      expect(res.status).toBe(200);
      expect(res.body.users).toEqual(mockUsers);
    });
  });
});
