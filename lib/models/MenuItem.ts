import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMenuItem extends Document {
  name: string;
  category: "fuchka" | "chatpati" | "corn";
  available: boolean;
}

const MenuItemSchema = new Schema<IMenuItem>(
  {
    name: { type: String, required: true },
    category: {
      type: String,
      enum: ["fuchka", "chatpati", "corn"],
      required: true,
    },
    available: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const MenuItem: Model<IMenuItem> =
  mongoose.models.MenuItem ||
  mongoose.model<IMenuItem>("MenuItem", MenuItemSchema);

export default MenuItem;

