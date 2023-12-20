import { Schema, model } from 'mongoose';
import { TUser, UserModel } from './user.interface';
import bcrypt from 'bcrypt';
import config from '../../config';
import { number } from 'joi';

const userSchema = new Schema<TUser, UserModel>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'password is required'],
      maxlength: [20, 'password must be at most 20 characters long'],
      select: 0,
      // required: [true, 'id is required']
    },
    needsPasswordChange: {
      type: Boolean,
      default: true,
    },
    passwordChangedAt: {
      type: Date,
    },
    role: {
      type: String,
      enum: ['admin', 'student', 'faculty'],
    },
    status: {
      type: String,
      enum: ['in-progress', 'blocked'],
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

userSchema.statics.isUserExistsByCustomId = async (id: string) => {
  return await User.findOne({ id }).select("+password");
};

userSchema.statics.isPasswordMatched = async function (
  palinTextPassword,
  hashedPassword,
) {
  return await bcrypt.compare(palinTextPassword, hashedPassword);
};

userSchema.statics.isJWTIssuedBeforePasswordChanged = async (
  passwordChangedTimestamp: Date,
  jwtIssuedTimestamp: number,
) => {
  const passwordChangedTime = new Date(passwordChangedTimestamp).getTime() / 1000;
  return passwordChangedTime > jwtIssuedTimestamp;
};

const User = model<TUser, UserModel>('User', userSchema);

export default User;
