import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface TicketAuditsAttrs {
  operation: Operations;
  userId: string;
  ticketId: string;
}

enum Operations {
  SOLD = "SOLD",
  SELL = "SELL",
  CANCEL = "CANCEL",
  AWAITINGPAY = "AWAITINGPAY",
}

interface TicketAuditsDoc extends mongoose.Document {
  operation: string;
  userId: string;
  ticketId: string;
  version: number;
}

interface TicketAuditsModel extends mongoose.Model<TicketAuditsDoc> {
  build(attrs: TicketAuditsAttrs): TicketAuditsDoc;
}

const ticketAuditsSchema = new mongoose.Schema(
  {
    operation: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    ticketId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

ticketAuditsSchema.set("versionKey", "version");
ticketAuditsSchema.plugin(updateIfCurrentPlugin);

ticketAuditsSchema.statics.build = (attrs: TicketAuditsAttrs) => {
  return new TicketAudits(attrs);
};

const TicketAudits = mongoose.model<TicketAuditsDoc, TicketAuditsModel>(
  "TicketAudits",
  ticketAuditsSchema
);

export { TicketAudits };
