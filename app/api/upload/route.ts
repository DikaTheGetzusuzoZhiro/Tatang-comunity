import { connectDB } from "@/lib/db";
import Mod from "@/models/Mod";

export async function POST(req: Request) {
  const body = await req.json();

  await connectDB();

  const mod = await Mod.create({
    title: body.title,
    description: body.description,
    category: body.category,
    fileUrl: body.fileUrl,
    thumbnail: body.thumbnail
  });

  return Response.json({ success: true, mod });
}
