import { connectDB } from "@/lib/mongodb";
import OrderState from "@/lib/models/OrderState";
import { pusherServer } from "@/lib/pusher-server";

export async function PATCH(request: Request) {
  await connectDB();
  const body = await request.json();
  const { currentOrder, waterBottleCount, showOrders } = body;

  let state = await OrderState.findOne({});
  if (!state) {
    state = await OrderState.create({
      currentOrder: typeof currentOrder === "number" ? currentOrder : 1,
      waterBottleCount: typeof waterBottleCount === "number" ? Math.max(0, waterBottleCount) : 0,
      showOrders: typeof showOrders === "boolean" ? showOrders : true,
    });
  } else {
    if (typeof currentOrder === "number") {
      state.currentOrder = currentOrder;
    }
    if (typeof waterBottleCount === "number") {
      state.waterBottleCount = Math.max(0, waterBottleCount);
    }
    if (typeof showOrders === "boolean") {
      state.showOrders = showOrders;
    }
    await state.save();
  }

  const payload = {
    currentOrder: state.currentOrder,
    waterBottleCount: state.waterBottleCount ?? 0,
    showOrders: state.showOrders ?? true,
  };

  try {
    await pusherServer.trigger("jhupri-channel", "order-update", payload);
  } catch (err) {
    console.error("Pusher trigger error:", err);
  }

  return Response.json(payload);
}
