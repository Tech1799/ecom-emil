// token, model and interface imports
import userModel from "./user.model";
import token from "@utils/token";
import type User from "@resources/user/user.interface";

class userService {
  private user = userModel;
  // testing the connections and other craps
  // public testService(subject: string): Promise<string | Error> {
  //   try {

  //   } catch (_error) {
  //     console.error("Error: ", _error);
  //     throw new Error("fuck it, i am out!");
  //   }
  // }

  // public async adminRegisterService(
  //   name: string,
  //   email: string,
  //   password: string,
  //   role: string
  // ): Promise<string | Error> {
  //   try {
  //     const user = await this.user.create({ name, email, password, role });
  //     const accessToken = token.createToken(user);
  //     return accessToken;
  //   } catch (error) {
  //     console.error("Error: ", error);
  //     throw new Error("Unable to create a user");
  //   }
  // }

  public async customerRegisterService(
    name: string,
    email: string,
    password: string,
    role: string
  ): Promise<string | Error> {
    try {
      const customer = await this.user.create({ name, email, password, role });
      const accessToken = token.createToken(customer);
      return accessToken;
    } catch (error) {
      console.error("Error: ", error);
      throw new Error("Unable to create a user");
    }
  }

  /**
   * @description Attempt to login user
   */
  public async login(email: string, password: string): Promise<string | Error> {
    try {
      const user = await this.user.findOne({ email });
      if (!user) {
        throw new Error("Unable to find user with that Email Address");
      }
      if (await user.isValidPassword(password)) {
        return token.createToken(user);
      } else {
        throw new Error("Wrong credentials given");
      }
    } catch (error) {
      console.error("Error: ", error);
      throw new Error("Unable to login user");
    }
  }

  /**
   * @description return an array of all users
   */
  public async findAllUsers(): Promise<User[] | Error> {
    try {
      const users = await this.user.find();
      return users;
    } catch (error) {
      console.error("Error: ", error);
      throw new Error("Unable find the users! internal server error!!");
    }
  }
}

export default userService;
