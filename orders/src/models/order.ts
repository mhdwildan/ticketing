// @ts-nocheck
import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
//enum status dari middleware
import { OrderStatus } from '@mwdtickets/common';
//import TicketDoc dari models ticket
import { TicketDoc } from './ticket';

export { OrderStatus };

// Interface yang didalamnya terdapat properties
// yang dibutuhkan untuk membuat data User Baru
interface OrderAttrs {
  userId: string;
  status: OrderStatus; //dari middleware
  expiresAt: Date;
  ticket: TicketDoc; //dari tiket models mongoDB
}

// Interface yang dimiliki oleh User Documentation
interface OrderDoc extends mongoose.Document {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
  version: number;
}

// Interface yang didalamnya terdapat properties
// yang dimiliki User model dan juga Terkait dg User Domentation
interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

//mongoose Schema adalah inisiasi structure property of document
//yang akan dimasukkan/diolah oleh mongoDB
const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      //pastikan value sesuai 4 dengan pilihan status Enum middleware
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created //default jika kosong
    },
    expiresAt: {
      type: mongoose.Schema.Types.Date,
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ticket',
    },
  },
  {
    //convert data default MongoDB format ke object data JSON 
    //yang umum digunakan agar mudah trx data antar bhs program
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

//mengganti format default '__V' dengan text 'version' agar lebih mudah dimengerti
orderSchema.set('versionKey', 'version');
//use plugin version data menegement
orderSchema.plugin(updateIfCurrentPlugin);

//fungsi membuat data user baru tetapi dengan format 
//yg sudah ditentukan
orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order(attrs);
};

//menggabungkan struktur fungsi diatas
//fungsi dari <> dibawah adalah untuk mengidentifikasi parameter Obj
//yang digunakan di function ini
const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export { Order };
