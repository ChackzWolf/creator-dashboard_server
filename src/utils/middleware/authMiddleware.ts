// middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../errors';

export interface AuthRequest extends Request {
  userId?: string;
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return next(new AppError('No token provided', 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string, role: string };
    req.userId = decoded.id;
    next();
  } catch (err) {
    next(new AppError('Invalid token', 403));
  }
};
