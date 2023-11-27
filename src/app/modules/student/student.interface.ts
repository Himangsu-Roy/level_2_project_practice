// import { Schema, model, connect } from 'mongoose';

import { Model, Types } from 'mongoose';

export type TGuardian = {
  fatherName: string;
  fatherContactNo: string;
  fatherOccupation: string;
  motherName: string;
  motherContactNo: string;
  motherOccupation: string;
};

export type TStudentName = {
  firstName: string;
  lastName: string;
  middleName?: string;
};

export type TLocalGuardian = {
  name: string;
  occupation: string;
  contactNo: string;
  address: string;
};

export type TStudent = {
  id: string;
  user: Types.ObjectId;
  password: string;
  name: TStudentName;
  gender: 'male' | 'female' | 'other';
  dateOfBirth?: string;
  contactNo: string;
  emergencyContactNo: string;
  bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  presentAddress: string;
  permanentAddress: string;
  guardian: TGuardian;
  email: string;
  avatar?: string;
  localGuardian: TLocalGuardian;
  profileImg?: string;
  // isActive: 'active' | 'blocked';
  isDeleted: boolean;
};

// for creating static function
export type StudentModel = {
  isUserExists(id: string): Promise<TStudent | null>;
  // isUserExistsByEmail(email: string): Promise<TStudent | null>
  // isUserExistsByContactNo(contactNo: string): Promise<TStudent | null>
} & Model<TStudent>

// For Creating instance constructor function
// export type StudentMethods = {
//   isUserExists(id: string): Promise<TStudent | null>
// }

// export type StudentModel = Model<TStudent, Record<string, never>, StudentMethods>;
