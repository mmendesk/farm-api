import { model, Schema, Document } from "mongoose";

export interface ICalf extends Document {
  earringId: string;
  weightOne: string;
  weightTwo: string;
  weightThree: string;
  sex: string;
  dateWeightOne?: Date;
  dateWeightTwo?: Date;
  dateWeightThree?: Date;
  updated_at?: Date;
  created_at?: Date;
}

const CalfSchema: Schema = new Schema(
  {
    earringId: { type: String, required: true },
    weightOne: { type: String, required: true },
    weightTwo: { type: String, required: false },
    weightThree: { type: String, required: false },
    sex: { type: String, required: true },
    dateWeightOne: { type: String, required: false },
    dateWeightTwo: { type: String, required: false },
    dateWeightThree: { type: String, required: false },
  },
  { timestamps: true }
);

export default model<ICalf>("Calf", CalfSchema);
