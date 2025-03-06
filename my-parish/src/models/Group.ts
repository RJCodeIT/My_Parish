import mongoose, { Schema, Document } from "mongoose";

export interface IGroup extends Document {
  name: string;
  description?: string;
  leaderId: mongoose.Types.ObjectId;
  members: mongoose.Types.ObjectId[];
  meetingSchedule?: string;
  createdAt: Date;
  updatedAt: Date;
}

const GroupSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    leaderId: { type: Schema.Types.ObjectId, ref: "Parishioner", required: true },
    members: [{ type: Schema.Types.ObjectId, ref: "Parishioner", default: [] }],
    meetingSchedule: { type: String },
  },
  { timestamps: true }
);

const Group =
  mongoose.models.Group || mongoose.model<IGroup>("Group", GroupSchema);

export default Group;
