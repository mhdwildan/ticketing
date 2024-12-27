// @ts-nocheck
import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { Order, OrderStatus } from './order';

// Interface yang didalamnya terdapat properties
// yang dibutuhkan untuk membuat data User Baru
interface TicketAttrs {
  id : string; //tambahkan komponen id properti dari Event
  title: string;
  price: number;
}
// Interface yang dimiliki oleh User Documentation
// export interface agar bisa dipakai di order models
export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  version: number;
  isReserved(): Promise<boolean>;
}

// Interface yang didalamnya terdapat properties
// yang dimiliki User model dan juga Terkait dg User Domentation
interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<TicketDoc | null>;
}

//mongoose Schema adalah inisiasi structure property of document
//yang akan dimasukkan/diolah oleh mongoDB
const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
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

//mengganti format default '__V' dengan text 'version' agar lebih mudah dimengerti
ticketSchema.set('versionKey', 'version');
//use plugin version data menegement
ticketSchema.plugin(updateIfCurrentPlugin);

//temukan id ticket yg akan di update
// dan pastikan data itu versi sebelum dari data Event
ticketSchema.statics.findByEvent = (event: { id: string; version: number }) => {
  return Ticket.findOne({
    _id: event.id,
    version: event.version - 1,
  });
};

//fungsi membuat data user baru tetapi dengan format 
//yg sudah ditentukan
ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket({
    _id: attrs.id, //buat data properti id menjadi Default DB _id
    title: attrs.title,
    price: attrs.price,
  });
};

ticketSchema.methods.isReserved = async function () {
  // this === the ticket document that we just called 'isReserved' on
  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
      ],
    },
  });

  return !!existingOrder;
};

//menggabungkan struktur fungsi diatas
//fungsi dari <> dibawah adalah untuk mengidentifikasi parameter Obj
//yang digunakan di function ini
const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket };
