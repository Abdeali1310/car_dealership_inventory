import { requireAuth } from "../../src/middleware/auth.middleware";
import { signToken } from "../../src/lib/jwt";
import { Request, Response, NextFunction } from "express";

describe("auth.middleware.ts - requireAuth", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockReq = {
      headers: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    nextFunction = jest.fn() as unknown as NextFunction;
  });

  it("should call next() and attach user info when given a valid token", async () => {
    const payload = { id: "user-123", sub: "user-123", email: "test@example.com", role: "CUSTOMER" };
    const token = signToken(payload);
    
    mockReq.headers = {
      authorization: `Bearer ${token}`,
    };

    await requireAuth(mockReq as Request, mockRes as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalled();
    expect((mockReq as any).user).toBeDefined();
    expect((mockReq as any).user.id).toBe("user-123");
    expect((mockReq as any).user.sub).toBe("user-123");
    expect((mockReq as any).user.role).toBe("CUSTOMER");
  });

  it("should return 401 when there is no Authorization header", async () => {
    mockReq.headers = {};

    await requireAuth(mockReq as Request, mockRes as Response, nextFunction);

    expect(nextFunction).not.toHaveBeenCalled();
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: "No token provided",
      })
    );
  });

  it("should return 401 when the token is invalid/expired", async () => {
    mockReq.headers = {
      authorization: "Bearer invalid-token-123",
    };

    await requireAuth(mockReq as Request, mockRes as Response, nextFunction);

    expect(nextFunction).not.toHaveBeenCalled();
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: "Invalid or expired token",
      })
    );
  });
});
