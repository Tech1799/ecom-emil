import { Request, Response } from "express";
import HttpException from "@utils/exceptions/http.exception";

function ErrorMiddleware(
  error: HttpException,
  req: Request,
  res: Response
): void {
  const status: number = error.status || 500;
  const message: string = error.message || "something went wrong";

  res.status(status).send({
    status,
    message,
  });
}

export default ErrorMiddleware;
