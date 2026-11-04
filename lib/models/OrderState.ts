import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOrderState extends Document {
  currentOrder: number;
  scale: number;
}

const OrderStateSchema = new Schema<IOrderState>(
  {
    currentOrder: { type: Number, default: 1 },
    scale: { type: Number, default: 100 },
  },
  { timestamps: true }
);

const OrderState: Model<IOrderState> =
  mongoose.models.OrderState ||
  mongoose.model<IOrderState>("OrderState", OrderStateSchema);

export default OrderState;

