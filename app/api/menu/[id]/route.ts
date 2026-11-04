import { connectDB } from "@/lib/mongodb";
import MenuItem from "@/lib/models/MenuItem";
import { pusherServer } from "@/lib/pusher-server";
import type { NextRequest } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const { id } = await params;
  const { available } = await request.json();

  const updated = await MenuItem.findByIdAndUpdate(
    id,
    { available },
    { new: true }
  ).lean();

  if (!updated) {
    return Response.json({ error: "Item not found" }, { status: 404 });
  }

  try {
    await pusherServer.trigger("jhupri-channel", "item-update", {
      itemId: id,
      available,
    });
  } catch (err) {
    console.error("Pusher trigger error:", err);
  }

  return Response.json(updated);
}
