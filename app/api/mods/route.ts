import { connectDB } from "@/lib/db";
import Mod from "@/models/Mod";

export async function GET() {
  await connectDB();
  const mods = await Mod.find().sort({ createdAt: -1 });
  return Response.json(mods);
}
