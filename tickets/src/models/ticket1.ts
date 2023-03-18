import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface TicketAttrs {
  serialNumber: string;
  concertId: mongoose.Types.ObjectId;
  ticketCategoryId: mongoose.Types.ObjectId;
  seat: string;
  userId: string;
}

interface TicketDoc extends mongoose.Document {
  serialNumber: string;
  concertId: mongoose.Types.ObjectId;
  ticketCategoryId: mongoose.Types.ObjectId;
  seat: string;
  userId: string;
  version: number;
  orderId?: string;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
}

const ticketSchema = new mongoose.Schema(
  {
    serialNumber: {
      type: String,
      required: true,
    },
    concertId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Concert",
      required: true,
    },
    ticketCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TicketCategory",
      required: true,
    },
    seat: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    orderId: {
      type: String,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

ticketSchema.set("versionKey", "version");
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(attrs);
};

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);

export { Ticket };
