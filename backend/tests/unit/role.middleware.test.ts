import { requireRole } from "../../src/middleware/role.middleware";
import { Request, Response, NextFunction } from "express";

describe("role.middleware.ts - requireRole", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockReq = {};
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    nextFunction = jest.fn() as unknown as NextFunction;
  });

  it("should call next() when req.user exists and has the required role", async () => {
    mockReq.user = {
      id: "user-123",
      sub: "user-123",
      email: "admin@example.com",
      role: "ADMIN",
    };

    const middleware = requireRole("ADMIN");
    await middleware(mockReq as Request, mockRes as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalled();
    expect(mockRes.status).not.toHaveBeenCalled();
  });

  it("should return 403 Forbidden when req.user has a different role", async () => {
    mockReq.user = {
      id: "user-123",
      sub: "user-123",
      email: "customer@example.com",
      role: "CUSTOMER",
    };

    const middleware = requireRole("ADMIN");
    await middleware(mockReq as Request, mockRes as Response, nextFunction);

    expect(nextFunction).not.toHaveBeenCalled();
    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: "Forbidden: Access denied",
      })
    );
  });

  it("should return 401 when req.user doesn't exist", async () => {
    mockReq.user = undefined;

    const middleware = requireRole("ADMIN");
    await middleware(mockReq as Request, mockRes as Response, nextFunction);

    expect(nextFunction).not.toHaveBeenCalled();
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: "Unauthorized",
      })
    );
  });
});
