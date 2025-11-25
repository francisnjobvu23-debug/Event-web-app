import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

export interface AuthRequest extends Request {
  user?: any;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });

  const token = String(authHeader).split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const user = jwt.verify(token, JWT_SECRET) as any;
    req.user = user;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

export const getUserFromRequest = (req: AuthRequest) => req.user;

