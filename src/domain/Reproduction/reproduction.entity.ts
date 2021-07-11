import { model, Schema, Document } from "mongoose";

export interface IReproduction extends Document {
  earringId: string;
  vermifuge: string;
  supplementation: string;
  date?: Date;
  winDate?: Date;
  updated_at?: Date;
  created_at?: Date;
}

const ReproductionSchema: Schema = new Schema(
  {
    earringId: { type: String, required: true },
    vermifuge: { type: String, required: false },
    supplementation: { type: String, required: false },
    date: { type: String, required: false },
    winDate: { type: String, required: false },
  },
  { timestamps: true }
);

export default model<IReproduction>("Reproduction", ReproductionSchema);
