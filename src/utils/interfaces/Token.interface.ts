import type { Schema } from "mongoose";

export interface Token {
  id: Schema.Types.ObjectId;
  expiresIn: number;
}
