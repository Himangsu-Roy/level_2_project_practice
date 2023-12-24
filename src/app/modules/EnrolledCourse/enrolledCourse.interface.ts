import { Types } from 'mongoose';

export type TGrade = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'NA';

export type TEnrolledCourseMarks = {
  classTest1: number;
  midTerm: number;
  classTest2: number;
  finalTerm: number;
};

export type TEnrolledCourse = {
  semesterRegistration: Types.ObjectId;
  course: Types.ObjectId;
  academicSemester: Types.ObjectId;
  academicFaculty: Types.ObjectId;
  academicDepartment: Types.ObjectId;
  offeredCourse: Types.ObjectId;
  student: Types.ObjectId;
  faculty: Types.ObjectId;
  courseMarks: TEnrolledCourseMarks;
  isEnrolled: boolean;
  grade: TGrade;
  gradePoints: number;
  isCompleted: boolean;
};
