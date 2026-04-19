import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
    event: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
    studentName: { type: String, required: true },
    studentEmail: { type: String, required: true },
    studentPhone: { type: String, required: true },
  },
  { timestamps: true }
);

registrationSchema.index({ studentEmail: 1, event: 1 }, { unique: true });

export default mongoose.model("Registration", registrationSchema);