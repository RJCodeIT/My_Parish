import mongoose, { Schema, Document } from "mongoose";

export interface INews extends Document {
  title: string;
  subtitle: string;
  content: string;
  imageUrl?: string;
  date: Date;
}

const NewsSchema = new Schema<INews>({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  content: { type: String, required: true },
  imageUrl: { type: String, required: false },
  date: { type: Date, default: Date.now },
});

export default mongoose.models.News || mongoose.model<INews>("News", NewsSchema);
