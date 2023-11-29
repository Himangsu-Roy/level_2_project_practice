import config from '../../config';
import AcademicSemester from '../academicSemester/academicSemester.model';
import { TStudent } from '../student/student.interface';
import Student from '../student/student.model';
import { TUser } from './user.interface';
import User from './user.model';
import { genarateStudentId } from './user.utils';

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
  const academicSemester = await AcademicSemester.findById(
    payload.addmissionSemester,
  );

  //set manually genarated id
  userData.id = await genarateStudentId(academicSemester);

  // create a user
  //Static data create
  const newUser = await User.create(userData);

  //create a student
  if (Object.keys(newUser).length) {
    // set id, _id as user
    payload.id = newUser.id; // embaded id
    payload.user = newUser._id; // reference _id

    const newStudent = await Student.create(payload);

    return newStudent;
  }
};

export const UserServices = { createStudentIntoDB };
