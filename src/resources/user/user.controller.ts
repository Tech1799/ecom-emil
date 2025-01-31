import type { Controller } from "@utils/interfaces/Controller.interface";
import type { NextFunction, Response, Request } from "express";
import { Router } from "express";
import userService from "@resources/user/user.service";
import validationMiddleware from "@middlewares/validation.middleware";
import validate from "@resources/user/user.validation";
import HttpException from "@utils/exceptions/http.exception";
import authMiddleware from "@middlewares/auth.middleware";
// import userModel from "@resources/user/user.model";

class userController implements Controller {
  public path = "/user";
  public router = Router();
  private userService = new userService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // this.router.post(
    //   `${this.path}/admin/register`,
    //   validationMiddleware(validate.register),
    //   this.registerAdmin
    // );
    this.router.post(
      `${this.path}/customer/register`,
      validationMiddleware(validate.register),
      this.registerCustomer
    );
    this.router.post(
      `${this.path}/login`,
      validationMiddleware(validate.login),
      this.login
    );
    this.router.get(`${this.path}/me`, authMiddleware, this.getUser);
    this.router.get(`${this.path}/all`, authMiddleware, this.getAllUsers);
    this.router.patch(`${this.path}/me/`, authMiddleware, this.updateMe);
    // this.router.get(
    //   `${this.path}/check`,
    //   authMiddleware,
    //   this.checkAuthMiddleware
    // );
    // updating your own stuff
    // update user by admin
  }

  // changing my identity
  private updateMe = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    if (!req.user) {
      return next(new HttpException(404, "No logged in user"));
    }
    const updates = Object.keys(req.body);
    const allowedUpdates = ["name", "email", "password"];
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
      return res.status(400).send({ error: "Invalid updates!" });
    }

    try {
      updates.forEach((update) => (req.user[update] = req.body[update]));
      await req.user.save();
      // await userModel.findByIdAndUpdate(req.user.id, req.body);
      res.send(req.user);
    } catch (e) {
      res.status(400).send(e);
    }
  };

  // checking auth middleware
  // private checkAuthMiddleware = async (
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ): Promise<Response | void> => {
  //   try {
  //     res.send(req.user);
  //   } catch (error) {
  //     if (error instanceof Error) {
  //       next(new HttpException(400, error.message));
  //     }
  //     next(new HttpException(400, "something went wrong"));
  //   }
  // };

  // special shit
  // private registerAdmin = async (
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ): Promise<Response | void> => {
  //   try {
  //     const { name, email, password } = req.body;
  //     const token = await this.userService.adminRegisterService(
  //       name,
  //       email,
  //       password,
  //       "admin"
  //     );
  //     res.status(201).json({ token });
  //   } catch (error: any) {
  //     next(new HttpException(400, error.message));
  //   }
  // };

  // everyone's shit
  private registerCustomer = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { name, email, password } = req.body;
      const token = await this.userService.customerRegisterService(
        name,
        email,
        password,
        "customer"
      );
      res.status(201).json({ token });
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };

  // if you have the key, open it brodah
  private login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { email, password } = req.body;
      const token = await this.userService.login(email, password);
      res.status(200).json({ token });
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };

  // god's shit
  private getUser = (
    req: Request,
    res: Response,
    next: NextFunction
  ): Response | void => {
    if (!req.user) {
      return next(new HttpException(404, "No logged in user"));
    }
    try {
      res.status(200).json({ user: req.user });
    } catch (error) {
      if (error instanceof Error) {
        next(new HttpException(400, error.message));
      }
      next(new HttpException(400, "No user found"));
    }
  };

  //admin privilege
  private getAllUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    if (!req.user) {
      return next(new HttpException(404, "No logged in user"));
    } else if (req.user.role !== "admin") {
      return next(new HttpException(400, "Access denied"));
    }

    try {
      const users = await this.userService.findAllUsers();
      res.status(200).json(users);
    } catch (error) {
      if (error instanceof Error) {
        next(new HttpException(400, error.message));
      }
      next(new HttpException(400, "No user found"));
    }
  };
}

export default userController;
