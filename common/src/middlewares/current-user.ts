import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface UserPayload {
  id: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // if (!req.session?.jwt) {
  //   return next();
  // }

  const jwtCookie = req.headers.cookie?.split(';').find((cookie: string) => cookie.trim().startsWith('jwt='));

  if (jwtCookie) {
    const token = jwtCookie.trim().substring(4);
    try {
      const payload = jwt.verify(
        token,
        process.env.JWT_KEY!
      ) as UserPayload;
      req.currentUser = payload;
    } catch (err) {}
  }
  next();
};
