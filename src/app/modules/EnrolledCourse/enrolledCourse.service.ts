import { TEnrolledCourse } from "./enrolledCourse.interface";

const createEnrolledCourseIntoDB = async (userId: string, payload: TEnrolledCourse) => { 

};

const updateEnrolldedCourseMarksIntoDB = async (facultyId: string, payload: Partial<TEnrolledCourse>) => { 

};

export const EnrolledCourseService = {
  createEnrolledCourseIntoDB,
  updateEnrolldedCourseMarksIntoDB,
};
