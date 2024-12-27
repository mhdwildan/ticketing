import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

//Data Attribut untuk kebutuhan jenis data
interface TicketAttrs {
  title: string;
  price: number;
  userId: string;
}

//data dokumen untuk menampung data dari input
interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
  version: number; 
  orderId?: string; //data bisa berupa id / undefined
}

//data Model, untuk menggabungkan atribut dan dokumen
interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
}

//skema berfungsi untuk mongoose setup kebutuhan data
const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    //order id untuk mengkoneksikan ticket dg order
    orderId: { //unrequired karena bisa undefined
      type: String,
    },
  },
  //ubah retur default dari mongoose, sesuai kebutuhan
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

ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(attrs);
};

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket };
