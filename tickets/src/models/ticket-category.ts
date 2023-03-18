import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface TicketCatAttrs {
  description: string;
  price: number;
  startDate?: Date;
  endDate?: Date;
  area?: string;
  concertId: mongoose.Types.ObjectId;
}

interface TicketCatDoc extends mongoose.Document {
  description: string;
  price: number;
  startDate?: Date;
  endDate?: Date;
  area?: string;
  concertId: mongoose.Types.ObjectId;
  version: number;
}

interface TicketCatModel extends mongoose.Model<TicketCatDoc> {
  build(attrs: TicketCatAttrs): TicketCatDoc;
}

const ticketCatSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    area: {
      type: String,
    },
    concertId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Concert",
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

ticketCatSchema.set("versionKey", "version");
ticketCatSchema.plugin(updateIfCurrentPlugin);

ticketCatSchema.statics.build = (attrs: TicketCatAttrs) => {
  return new TicketCategory(attrs);
};

const TicketCategory = mongoose.model<TicketCatDoc, TicketCatModel>(
  "TicketCategory",
  ticketCatSchema
);

export { TicketCategory };
