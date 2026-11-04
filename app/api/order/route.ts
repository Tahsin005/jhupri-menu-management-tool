import { connectDB } from "@/lib/mongodb";
import OrderState from "@/lib/models/OrderState";
import { pusherServer } from "@/lib/pusher-server";

export async function PATCH(request: Request) {
  await connectDB();
  const body = await request.json();
  const { currentOrder, scale } = body;

  let state = await OrderState.findOne({});
  if (!state) {
    state = await OrderState.create({
      currentOrder: typeof currentOrder === "number" ? currentOrder : 1,
      scale: typeof scale === "number" ? scale : 100,
    });
  } else {
    if (typeof currentOrder === "number") {
      state.currentOrder = currentOrder;
    }
    if (typeof scale === "number") {
      state.scale = scale;
    }
    await state.save();
  }

  const payload = {
    currentOrder: state.currentOrder,
    scale: state.scale ?? 100,
  };

  try {
    await pusherServer.trigger("jhupri-channel", "order-update", payload);
  } catch (err) {
    console.error("Pusher trigger error:", err);
  }

  return Response.json(payload);
}

