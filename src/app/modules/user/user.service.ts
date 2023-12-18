/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import config from '../../config';
import AcademicSemester from '../academicSemester/academicSemester.model';
import { TStudent } from '../student/student.interface';
import Student from '../student/student.model';
import { TUser } from './user.interface';
import User from './user.model';
import { genarateStudentId } from './user.utils';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const createStudentIntoDB = async (password: string, payload: TStudent) => {
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

  // find academic semester info
  const admissionSemester = await AcademicSemester.findById(
    payload.addmissionSemester,
  );

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    userData.id = await genarateStudentId(admissionSemester);

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

    // create a student(transaction-2)
    const newStudent = await Student.create([payload], { session });
    if (!newStudent.length) {
      throw new AppError('Student not created', httpStatus.BAD_REQUEST);
    }

    await session.commitTransaction();
    await session.endSession();
    return newStudent;
  } catch (error: any){
    await session.abortTransaction();
    await session.endSession();
    throw new AppError('Unable to create student', httpStatus.BAD_REQUEST);
    throw new Error(error);
  }
};

export const UserServices = { createStudentIntoDB };
