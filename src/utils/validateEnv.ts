import { cleanEnv, str, port } from "envalid";

function validateEnv(): void {
  cleanEnv(process.env, {
    // NODE_ENV: str({
    //     choices: ['development', 'production'],
    // }),
    MONGO_PASS: str(),
    MONGO_CL: str(),
    MONGO_USER: str(),
    PORT: port({ default: 3000 }),
    JWT_SECRET: str(),
  });
}

export default validateEnv;
