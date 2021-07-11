import { model, Schema, Document } from "mongoose";

export interface IMedicine extends Document {
  earringId: string;
  vermifuge: string;
  supplementation: string;
  remedy: string;
  remedyId: string;
  date?: Date;
  dateValidate?: Date;
  updated_at?: Date;
  created_at?: Date;
}

const MedicineSchema: Schema = new Schema(
  {
    earringId: { type: String, required: true },
    remedy: { type: String, required: true },
    vermifuge: { type: String, required: false },
    supplementation: { type: String, required: false },
    remedyId: { type: String, required: true },
    date: { type: String, required: false },
    dateValidate: { type: String, required: false },
  },
  { timestamps: true }
);

export default model<IMedicine>("Medicine", MedicineSchema);
