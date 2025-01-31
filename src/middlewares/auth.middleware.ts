import HttpException from "@utils/exceptions/http.exception";
import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { verifyToken } from "@utils/token";
import { Token } from "@utils/interfaces/Token.interface";
import userModel from "@resources/user/user.model";

async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  const bearer = req.headers.authorization;
  console.log(req.headers.authorization);

  if (!bearer || !bearer.startsWith("Bearer ")) {
    return next(new HttpException(401, "Unauthorised"));
  }

  const accessToken = bearer.split("Bearer ")[1].trim();
  console.log("----------------");
  console.log(accessToken);

  try {
    const payload: Token | jwt.JsonWebTokenError =
      await verifyToken(accessToken);
    console.log("----------");
    console.log(payload);

    if (payload instanceof jwt.JsonWebTokenError) {
      console.log("token is not valid");
      return next(new HttpException(401, "Unauthorised"));
    }

    const user = await userModel
      .findById(payload.id)
      .select("-password")
      .exec();
    console.log("----------");
    console.log(user);

    if (!user) {
      return next(new HttpException(401, "Unauthorised"));
    }
    req.user = user;
    return next();
  } catch (error) {
    if (error instanceof Error) {
      return next(new HttpException(401, error.message));
    }
    return next(new HttpException(401, "Unauthorised"));
  }
}

export default authMiddleware;
