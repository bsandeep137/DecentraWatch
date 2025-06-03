import type {NextFunction, Request, Response} from "express"
import jwt from "jsonwebtoken"
import 'dotenv/config';
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }
  const token = authHeader.split(' ')[1];
  if (!token) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }
  console.log(process.env.JWT_SECRET);
  const decoded = jwt.verify(token, process.env.JWT_SECRET as string)
  if (!decoded || typeof decoded !== 'object' || !decoded.sub) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }
  req.userid = decoded.sub as string;
  next();
};
