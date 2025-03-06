import mongoose, { Schema, Document } from "mongoose";

export interface IAnnouncement extends Document {
  title: string;
  date: Date;
  imageUrl?: string;
  content: { order: number; text: string }[];
  extraInfo?: string;
}

const AnnouncementSchema = new Schema<IAnnouncement>({
  title: { type: String, required: true },
  date: { type: Date, default: Date.now },
  imageUrl: { type: String, required: false },
  content: [
    {
      order: { type: Number, required: true },
      text: { type: String, required: true },
    },
  ],
  extraInfo: { type: String, required: false },
});

export default mongoose.models.Announcement ||
  mongoose.model<IAnnouncement>("Announcement", AnnouncementSchema);
