import mongoose, { Schema, Document } from "mongoose";

export interface ISacrament {
  type:
    | "baptism"
    | "firstCommunion"
    | "confirmation"
    | "marriage"
    | "holyOrders"
    | "anointingOfTheSick";
  date: Date;
}

export interface IParishioner extends Document {
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  address: {
    street: string;
    houseNumber: string;
    postalCode: string;
    city: string;
  };
  phoneNumber?: string;
  email?: string;
  sacraments: ISacrament[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SacramentSchema: Schema = new Schema({
  type: {
    type: String,
    enum: [
      "baptism",
      "firstCommunion",
      "confirmation",
      "marriage",
      "holyOrders",
      "anointingOfTheSick",
    ],
    required: true,
  },
  date: { type: Date, required: true },
});

const ParishionerSchema: Schema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    address: {
      street: { type: String, required: true },
      houseNumber: { type: String, required: true },
      postalCode: { type: String, required: true },
      city: { type: String, required: true },
    },
    phoneNumber: { type: String },
    email: { type: String, unique: true, sparse: true },
    sacraments: { type: [SacramentSchema], default: [] },
    notes: { type: String },
  },
  { timestamps: true }
);

const Parishioner =
  mongoose.models.Parishioner ||
  mongoose.model<IParishioner>("Parishioner", ParishionerSchema);

export default Parishioner;
