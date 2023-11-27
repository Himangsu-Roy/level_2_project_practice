import config from '../../config';
import { TStudent } from '../student/student.interface';
import Student from '../student/student.model';
import { TUser } from './user.interface';
import User from './user.model';

const createStudentIntoDB = async (password: string, studentData: TStudent) => {
  //   if (await Student.isUserExists(studentData.id)) {
  //     throw new Error('User already exists');
  //   }

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

  //set manually genarated id
  userData.id = '2030100001';

  // create a user
  //Static data create
  const newUser = await User.create(userData);

  //create a student
  if (Object.keys(newUser).length) {
    // set id, _id as user
    studentData.id = newUser.id; // embaded id
    studentData.user = newUser._id; // reference _id

    const newStudent = await Student.create(studentData);

    return newStudent;
  }

  // create a instance function
  // const student = new Student(studentData); // create an instance

  // if (await student.isUserExists(studentData.id)) {
  //   throw new Error('User already exists');
  // }

  // const result = await student.save(); // built in instance method
};

export const UserServices = { createStudentIntoDB };
