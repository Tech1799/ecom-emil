import type { Application } from "express";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import type { Controller } from "@utils/interfaces/Controller.interface";
import ErrorMiddleware from "@middlewares/error.middleware";
import mongoose from "mongoose";

class App {
  public express: Application;
  public port: number;

  constructor(controllers: Controller[], port: number) {
    this.express = express();
    this.port = port;
    this.initializeDb();
    this.initializeMiddleware();
    this.initializeControllers(controllers);
    // this.initializeErrorHandling();
  }

  private initializeMiddleware(): void {
    this.express.use(helmet()); // security headers
    this.express.use(cors());
    this.express.use(morgan("dev"));
    this.express.use(express.json());
    this.express.use(express.urlencoded({ extended: false }));
  }

  private initializeDb(): void {
    const { MONGO_USER, MONGO_PASS, MONGO_CL } = process.env;
    mongoose.connect(`mongodb+srv://${MONGO_USER}:${MONGO_PASS}@${MONGO_CL}`);
  }

  private initializeErrorHandling(): void {
    this.express.use(ErrorMiddleware);
  }

  private initializeControllers(controllers: Controller[]): void {
    controllers.forEach((controller: Controller) => {
      this.express.use("/api", controller.router);
    });
  }

  public listen(): void {
    this.express.listen(this.port, () => {
      console.log(`App listening on port ${this.port}`);
    });
  }
}

export default App;
