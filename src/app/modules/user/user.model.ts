import { Schema, model } from 'mongoose';
import { TUser } from './user.interface';
import bcrypt from 'bcrypt';
import config from '../../config';


const userSchema = new Schema<TUser>(
  {
    id: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: [true, 'password is required'],
      maxlength: [20, 'password must be at most 20 characters long'],
      // required: [true, 'id is required']
    },
    needsPasswordChange: {
      type: Boolean,
      default: true,
    },
    role: {
      type: String,
      enum: ['admin', 'student', 'faculty'],
    },
    status: {
      type: String,
      enum: ['in-progress', 'block'],
      default: 'in-progress',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// pre save middleware/hook
userSchema.pre('save', function (this: TUser, next) {
  // hashing password and save into DB
  bcrypt.hash(this.password, Number(config.bcrypt_salt_rounds), (err, hash) => {
    if (err) return next(err);
    this.password = hash;
    next();
  });
});

// post save middleware/hook
userSchema.post('save', function (doc, next) {
  doc.password = '';
  next();
});

const User = model<TUser>('User', userSchema);

export default User;
