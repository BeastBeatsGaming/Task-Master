import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import User, { IUser } from "../models/User";

// Extend Express Request type to include user
export interface AuthenticatedRequest extends Request {
  user?: IUser; // or any other type you expect for user
}

export const protect = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as JwtPayload;

      // Find user by ID from token, exclude password
      req.user = await User.findById(decoded.id).select("-password");
      if (!req.user) {
        res.status(401);
        throw new Error("Not authorized, user not found");
      }
      next();
    } catch (error) {
      console.error(error);
      res.status(401); // Unauthorized
      next(new Error("Not authorized, token failed"));
    }
  }

  if (!token) {
    res.status(401); // Unauthorized
    next(new Error("Not authorized, no token"));
  }
};
