import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { OrderStatus } from "@twicetickets/common";
import { TicketDoc } from "./ticket";

export { OrderStatus };

interface OrderAttrs {
  _id: string;
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  stripeCheckoutId: string;
  stripeCheckoutUrl: string;
  ticket: TicketDoc;
}

interface OrderDoc extends mongoose.Document {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  stripeCheckoutId: string;
  stripeCheckoutUrl: string;
  ticket: TicketDoc;
  version: number;
  createdAt: Date;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },
    expiresAt: {
      type: mongoose.Schema.Types.Date,
    },
    stripeCheckoutId: {
      type: String,
      required: true,
    },
    stripeCheckoutUrl: {
      type: String,
      required: true,
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
    },
    createdAt: {
      type: mongoose.Schema.Types.Date,
      default: Date.now,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.stripeCheckoutId;
      },
    },
  }
);

orderSchema.set("versionKey", "version");
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order(attrs);
};

orderSchema.pre<OrderDoc>("save", function (next) {
  if (this.isNew && !this.createdAt) {
    this.createdAt = new Date();
  }
  next();
});

const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema);

export { Order };
