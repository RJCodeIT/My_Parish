import mongoose, { Schema, Document } from "mongoose";

export interface IMass {
  time: string;
  intention: string;
}

export interface IIntention extends Document {
  title: string;
  date: Date;
  imageUrl?: string;
  masses: IMass[];
}

const IntentionSchema = new Schema<IIntention>({
  title: { type: String, required: true },
  date: { type: Date, default: Date.now },
  imageUrl: { type: String, required: false },
  masses: [
    {
      time: { type: String, required: true },
      intention: { type: String, required: true },
    },
  ],
});

export default mongoose.models.Intention ||
  mongoose.model<IIntention>("Intention", IntentionSchema);
