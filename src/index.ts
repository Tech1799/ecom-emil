import "dotenv/config";
import "module-alias/register";

import validateEnv from "@utils/validateEnv";
import App from "./app";

// controllers
import userController from "@resources/user/user.controller";

validateEnv();
const app = new App([new userController()], Number(process.env.PORT));
app.listen();
