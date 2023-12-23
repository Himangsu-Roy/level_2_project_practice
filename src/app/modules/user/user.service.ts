/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import config from '../../config';
import AcademicSemester from '../academicSemester/academicSemester.model';
import { TStudent } from '../student/student.interface';
import Student from '../student/student.model';
import { TUser } from './user.interface';
import User from './user.model';
import {
  genarateStudentId,
  generateAdminId,
  generateFacultyId,
} from './user.utils';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { Faculty } from '../Faculty/faculty.model';
import { Admin } from '../Admin/admin.model';
import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary';

const createStudentIntoDB = async (
  file: any,
  password: string,
  payload: TStudent,
) => {
  // create a user object
  const userData: Partial<TUser> = {};

  // if password is not provided then use default password
  userData.password = password || (config.default_user_password as string);
  // if (!password) {
  //     user.password = config.default_user_password as string;
  // } else {
  //     user.password = password;
  // }

  //set student role
  userData.role = 'student';
  userData.email = payload.email;

  // find academic semester info
  const admissionSemester = await AcademicSemester.findById(
    payload.addmissionSemester,
  );

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    userData.id = await genarateStudentId(admissionSemester);

    const imageName = `${userData?.id}${payload?.name?.firstName}`;
    const path = file?.path;
    //send image to cloudinary
    const { secure_url } = await sendImageToCloudinary(imageName, path);

    // create a user(transaction-1)
    //Static data create
    const newUser = await User.create([userData], { session });

    //create a student
    if (!newUser.length) {
      throw new AppError('User not created', httpStatus.BAD_REQUEST);
    }
    // set id, _id as user
    payload.id = newUser[0].id; // embaded id
    payload.user = newUser[0]._id; // reference _id
    payload.profileImg = secure_url;

    // create a student(transaction-2)
    const newStudent = await Student.create([payload], { session });

    if (!newStudent.length) {
      throw new AppError('Student not created', httpStatus.BAD_REQUEST);
    }

    await session.commitTransaction();
    await session.endSession();
    return newStudent;
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError('Unable to create student', httpStatus.BAD_REQUEST);
    throw new Error(error);
  }
};

const createFacultyIntoDB = async (password: string, payload: any) => {
  // create a user object
  const userData: Partial<TUser> = {};

  // if password is not provided then use default password
  userData.password = password || (config.default_user_password as string);
  // if (!password) {
  //     user.password = config.default_user_password as string;
  // } else {
  //     user.password = password;
  // }

  //set student role
  userData.role = 'faculty';
  //set faculty email
  userData.email = payload.email;

  // find academic department info
  const academicDepartment = await AcademicSemester.findById(
    payload.academicDepartment,
  );

  if (!academicDepartment) {
    throw new AppError('Academic Department not found', httpStatus.BAD_REQUEST);
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    userData.id = await generateFacultyId();

    // create a user(transaction-1)
    //Static data create
    const newUser = await User.create([userData], { session });

    //set id, _id as user
    payload.id = newUser[0].id; // embaded id
    payload.user = newUser[0]._id; // reference _id

    // create a student(transaction-2)
    const newFaculty = await Faculty.create([payload], { session });

    if (!newFaculty.length) {
      throw new AppError('Failed to create faculty', httpStatus.BAD_REQUEST);
    }
    await session.commitTransaction();
    await session.endSession();
    return newFaculty;
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError('Unable to create faculty', httpStatus.BAD_REQUEST);
    throw new Error(error);
  }
};

// Create Admin into DB
const createAdminIntoDB = async (file: any, password: string, payload: any) => {
  // create a user object
  const userData: Partial<TUser> = {};

  // if password is not provided then use default password
  userData.password = password || (config.default_user_password as string);
  // if (!password) {
  //     user.password = config.default_user_password as string;
  // } else {
  //     user.password = password;
  // }

  //set student role
  userData.role = 'admin';
  //set faculty email
  userData.email = payload.email;

  // find academic department info
  // const academicDepartment = await AcademicSemester.findById(
  //   payload.academicDepartment,
  // );

  // if(!academicDepartment) {
  //   throw new AppError('Academic Department not found', httpStatus.BAD_REQUEST);
  // }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    userData.id = await generateAdminId();

    // create a user(transaction-1)
    //Static data creat
    const newUser = await User.create([userData], { session });

    // create a admin
    if (!newUser.length) {
      throw new AppError('User not created', httpStatus.BAD_REQUEST);
    }
    // set id, _id as user
    payload.id = newUser[0].id; // embaded id
    payload.user = newUser[0]._id; // reference _id
    // create a admin(transaction-2)
    const newAdmin = await Admin.create([payload], { session });
    if (!newAdmin.length) {
      throw new AppError('Admin not created', httpStatus.BAD_REQUEST);
    }
    await session.commitTransaction();
    await session.endSession();
    return newAdmin;
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError('Unable to create admin', httpStatus.BAD_REQUEST);
    throw new Error(error);
  }
};

const changeStatus = async (id: string, status: string) => {
  const result = await User.findByIdAndUpdate(id, { status }, { new: true });
  return result;
};

const getMe = async (userId: string, role: string) => {
  if (role === 'admin') {
    const result = await Admin.findOne({ id: userId }).populate('user');
    return result;
  } else if (role === 'faculty') {
    const result = await Faculty.findOne({ id: userId }).populate('user');
    return result;
  } else if (role === 'student') {
    const result = await Student.findOne({ id: userId }).populate('user');
    return result;
  }
};

export const UserServices = {
  createStudentIntoDB,
  createAdminIntoDB,
  createFacultyIntoDB,
  changeStatus,
  getMe,
};
