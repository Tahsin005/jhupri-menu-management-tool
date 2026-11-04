import { connectDB } from "@/lib/mongodb";
import MenuItem from "@/lib/models/MenuItem";
import OrderState from "@/lib/models/OrderState";

const DEFAULT_MENU = [
  // Fuchka
  { name: "Regular Fuchka", category: "fuchka" },
  { name: "Naga Fuchka", category: "fuchka" },
  { name: "Shahi Fuchka", category: "fuchka" },
  { name: "Doi Fuchka", category: "fuchka" },
  // Chatpati
  { name: "Regular Chatpati", category: "chatpati" },
  { name: "Naga Chatpati", category: "chatpati" },
  { name: "Shahi Chatpati", category: "chatpati" },
  // Corn
  { name: "Regular Masala Corn", category: "corn" },
  { name: "Sweet Chili Corn", category: "corn" },
  { name: "Naga Corn", category: "corn" },
];

async function seedIfEmpty() {
  const count = await MenuItem.countDocuments();
  if (count === 0) {
    await MenuItem.insertMany(
      DEFAULT_MENU.map((item) => ({ ...item, available: true }))
    );
  }
  const orderCount = await OrderState.countDocuments();
  if (orderCount === 0) {
    await OrderState.create({ currentOrder: 1, scale: 100, waterBottleCount: 0 });
  }
}

export async function GET() {
  await connectDB();
  await seedIfEmpty();

  const [items, orderState] = await Promise.all([
    MenuItem.find({}).lean(),
    OrderState.findOne({}).lean(),
  ]);

  return Response.json({
    items,
    currentOrder: orderState?.currentOrder ?? 1,
    scale: orderState?.scale ?? 100,
    waterBottleCount: orderState?.waterBottleCount ?? 0,
  });
}

