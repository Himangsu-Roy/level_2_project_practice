import { Schema, model, connect } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';

import {
  TGuardian,
  TLocalGuardian,
  TStudent,
  StudentMethods,
  TStudentName,
  StudentModel,
} from './student/student.interface';
import { NextFunction } from 'mongoose';

import config from '../config';

const userNameSchema = new Schema<TStudentName>({
  firstName: {
    type: String,
    required: [true, 'First Name is required'],
    // minLength: [2, 'First Name must be at least 2 characters long'],
    maxLength: [20, 'First Name must be at most 20 characters long'],
    trim: true,
    validate: {
      validator: function (value: string) {
        const firstNameStr = value.charAt(0).toUpperCase() + value.slice(1);
        return firstNameStr === value;
      },
      message: 'First Name must be in cappitalize',
    },
  },
  middleName: {
    type: String,
    trim: true,
  },
  lastName: {
    type: String,
    trim: true,
    required: [true, 'Last Name is required'],
    validate: {
      validator: (value: string) => validator.isAlpha(value),
      message: 'Last Name must be alpha',
    },
  },
});

const guardianSchema = new Schema<TGuardian>({
  fatherName: { type: String, required: true },
  fatherContactNo: { type: String, required: true },
  fatherOccupation: { type: String, required: true },
  motherName: { type: String, required: true },
  motherContactNo: { type: String, required: true },
  motherOccupation: {
    type: String,
    required: true,
  },
});

const localGuardianSchema = new Schema<TLocalGuardian>({
  name: { type: String, required: true },
  occupation: { type: String, required: true },
  contactNo: { type: String, required: true },
  address: { type: String, required: true },
});

const studentSchema = new Schema<TStudent, StudentModel>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      // required: [true, 'id is required']
    },
    password: {
      type: String,
      required: [true, 'password is required'],
      maxlength: [20, 'password must be at most 20 characters long'],
      // required: [true, 'id is required']
    },
    name: {
      type: userNameSchema,
      required: true,
    },
    gender: {
      type: String,
      enum: {
        values: ['male', 'female', 'other'],
        message: '{VALUE} is not supported',
        //   message: "The gender field can only be one of the following: 'make', 'female', or 'other'.",
      },
      required: true,
    },
    dateOfBirth: { type: String },
    contactNo: { type: String, required: true },
    emergencyContactNo: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (value: string) => validator.isEmail(value),
        message: 'Invalid email',
        // message: "The email field must be a valid email address.",
      },
    },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    },
    presentAddress: { type: String, required: true },
    permanentAddress: { type: String, required: true },
    guardian: {
      type: guardianSchema,
      required: true,
    },
    localGuardian: {
      type: localGuardianSchema,
      required: true,
    },
    profileImg: { type: String },
    isActive: {
      type: String,
      enum: ['active', 'blocked'],
      default: 'active',
    },
    isDeleted: { type: Boolean, default: false },
  },
  {
    toJSON: {
      virtuals: true,
    },
  },
);

// virtual
studentSchema.virtual('fullName').get(function (this: TStudent) {
  return `${this.name.firstName} ${this.name.middleName} ${this.name.lastName}`;
});

// pre save middleware/hook
studentSchema.pre(
  'save' as 'insertMany',
  function (this: TStudent, next: NextFunction) {
    // hashing password and save into DB
    bcrypt.hash(
      this.password,
      Number(config.bcrypt_salt_rounds),
      (err, hash) => {
        if (err) return next(err);
        this.password = hash;
        next();
      },
    );
  },
);

// post save middleware/hook
studentSchema.post('save', function (doc, next: NextFunction) {
  doc.password = '';
  next();
});

// Query Middleware
studentSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

studentSchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

// aggrigate findone
// query middleware
studentSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

// creating a custom instance method
studentSchema.statics.isUserExists = async function (id: string) {
  const existingUser = await Student.findOne({ id });
  return existingUser;
};

// studentSchema.method('isUserExists', async function (id: string) {
//   return await this.model('TStudent').findOne({ id });
// });

// Creating a custom instance method
// studentSchema.methods.isUserExists = async function(id: string) {
//   const existingUser = await Student.findOne({ id });
//   return existingUser;
// }

studentSchema.index({ id: 1 }, { unique: true });

const Student = model<TStudent, StudentModel>('Student', studentSchema);

export default Student;
