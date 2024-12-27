import mongoose from 'mongoose';
import { Password } from '../services/password';

// Interface yang didalamnya terdapat properties
// yang dibutuhkan untuk membuat data User Baru
interface UserAttrs {
  email: string;
  password: string;
}

// Interface yang didalamnya terdapat properties
// yang dimiliki User model dan juga Terkait dg User Domentation
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// Interface yang didalamnya terdapat properties
// yang dimiliki oleh User Documentation
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

//mongoose Schema adalah inisiasi structure property of document
//yang akan dimasukkan/diolah oleh mongoDB
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
}, 
{
  //convert data default MongoDB format ke object data JSON 
  //yang umum digunakan agar mudah trx data antar bhs program
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.password;
      delete ret.__v;
    }
  }
}
);
userSchema.pre('save', async function(done) {
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }
  done();
});

//fungsi membuat data user baru tetapi dengan format 
//yg sudah ditentukan
//keyword : User.build
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

//menggabungkan struktur fungsi diatas
//fungsi dari <> dibawah adalah untuk mengidentifikasi parameter Obj
//yang digunakan di function ini
const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };
