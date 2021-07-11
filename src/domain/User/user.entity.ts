import { model, Schema, Types, Document } from "mongoose";
import { string } from "yup/lib/locale";

export interface IUser extends Document {
  name: string;
  login: string;
  email?: string;
  password: string;
  status: boolean;
  type: string;
  updated_at?: Date;
  created_at?: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    login: { type: String, required: true },
    email: { type: String, required: false },
    password: { type: String, required: true },
    status: { type: Boolean, default: false },
    type: { type: string, required: true },
  },
  { timestamps: true }
);

export default model<IUser>("User", UserSchema);
