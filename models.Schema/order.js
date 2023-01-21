import mongoose from "mongoose";
import Order from "../utils/order";

const orderSchema = new mongoose.Schema(
  {
    products: {
      type: [
        {
          productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
          },
          count: Number,
          price: Number,
        },
      ],
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    coupan: String,
    transactionId: String,
    status: {
      type: String,
    //   enum: ["ORDERED", "SHIPPED", "DELIVERED", "CANCELLED"],
      enum: Object.values(Order),
      default: Order.ORDERED,
    },
    //payment: UPI, creditcard or wallet, Cash on delivery
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Order", orderSchema);
