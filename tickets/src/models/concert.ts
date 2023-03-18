import mongoose, { Types } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

export interface ConcertAttrs {
  title: string;
  artist: Artist;
  date: Date;
  venue: Venue;
}

interface Artist {
  artistName: string;
  genre: Genre;
}

enum Genre {
  kpop = "kpop",
  pop = "pop",
}

interface Venue {
  venueName: string;
  location: string;
  type: string;
  capacity: number;
}

interface ConcertRole {
  concertId: string;
  artistId: string;
  role: Roles;
}

enum Roles {
  OPENING = "Opening act",
  SPECIAL = "Special guest",
  MAIN = "Main act",
}

interface ConcertDoc extends ConcertAttrs, mongoose.Document {
  title: string;
  artist: Artist;
  date: Date;
  venue: Venue;
  version: number;
}

interface ConcertModel extends mongoose.Model<ConcertDoc> {
  build(attrs: ConcertAttrs): ConcertDoc;
}

const concertSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    artist: {
      artistName: {
        type: String,
        required: true,
      },
      genre: {
        type: String,
        required: true,
      },
    },
    date: {
      type: Date,
      required: true,
    },
    venue: {
      venueName: {
        type: String,
        required: true,
      },
      location: String,
      type: { type: String },
      capacity: Number,
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

concertSchema.set("versionKey", "version");
concertSchema.plugin(updateIfCurrentPlugin);

concertSchema.statics.build = (attrs: ConcertAttrs) => {
  return new Concert(attrs);
};

const Concert = mongoose.model<ConcertDoc, ConcertModel>(
  "Concert",
  concertSchema
);

export { Concert };
