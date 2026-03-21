import mongoose from "mongoose";

const ModSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: String,
  thumbnail: String,
  fileUrl: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Mod || mongoose.model("Mod", ModSchema);
