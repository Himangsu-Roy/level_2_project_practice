import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import { CourseSearchabelFields } from './course.constant';
import { TCourse, TCoursefaculty } from './course.interface';
import { Course, CourseFaculty } from './course.model';
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';

const createCourseIntoDB = async (payload: TCourse) => {
  const result = await Course.create(payload);
  return result;
};

const getAllCoursesFromDB = async (query: Record<string, unknown>) => {
  const courseQuery = new QueryBuilder(
    Course.find().populate('preRequisiteCourse.course'),
    query,
  )
    .search(CourseSearchabelFields)
    .filter()
    .sort()
    .paginate()
    .limitFields();
  const result = await courseQuery.modelQuery;
  return result;
};

const getSingleCourseFromDB = async (id: string) => {
  const result = await Course.findById(id).populate(
    'preRequisiteCourse.course',
  );
  return result;
};

const deleteCourseFromDB = async (id: string) => {
  const result = await Course.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  return result;
};

const updateCourseIntoDB = async (id: string, payload: Partial<TCourse>) => {
  const { preRequisiteCourse, ...courseRestData } = payload;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const updatedCourse = await Course.findByIdAndUpdate(id, courseRestData, {
      new: true,
      runValidators: true,
      session,
    });

    if (!updatedCourse) {
      throw new AppError('Failed to update course', httpStatus.BAD_REQUEST);
    }

    if (preRequisiteCourse && preRequisiteCourse.length > 0) {
      // filter out the deleted fields
      const deletedPreRequisiteCourse = preRequisiteCourse
        .filter((elm) => elm.course && elm.isDeleted)
        .map((elm) => elm.course);

      
      const deletedPreRequisiteCourses = await Course.findByIdAndUpdate(
        id,
        {
          $pull: {
            preRequisiteCourse: { course: { $in: deletedPreRequisiteCourse } },
          },
        },
        {
          new: true,
          runValidators: true,
          session,
        },
      );

      console.log(deletedPreRequisiteCourses)

      if (!deletedPreRequisiteCourses) {
        throw new AppError('Failed to update course', httpStatus.BAD_REQUEST);
      }

      // filter out the new course fields
      const newPreRequisiteCourse = preRequisiteCourse.filter(
        (elm) => elm.course && !elm.isDeleted,
      );

      const newPreRequisiteCourses = await Course.findByIdAndUpdate(id, {
        //$addToSet: { preRequisiteCourse: { $each: newPreRequisiteCourse } },
        $push: { preRequisiteCourse: { $each: newPreRequisiteCourse } },
        new: true,
        runValidators: true,
        session,
      });

      if (!newPreRequisiteCourses) {
        throw new AppError('Failed to update course', httpStatus.BAD_REQUEST);
      }

      const result = await Course.findById(id).populate(
        'preRequisiteCourse.course',
      );

      return result;
    }

    await session.commitTransaction();
    await session.endSession();
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(
      "Failed to update course's prerequisite course",
      httpStatus.BAD_REQUEST,
    );
  }
};

const assignFacultiesWithCourseIntoDB = async (
  courseId: string,
  facultyIds: Partial<TCoursefaculty>,
) => {
  const result = await CourseFaculty.findByIdAndUpdate(
    courseId,

    { course: courseId, $push: { faculties: { $each: facultyIds } } },
    { new: true, upsert: true, runValidators: true },
  );
  return result;
};

const removeFacultiesFromCourseFromDB = async (
  courseId: string,
  facultyIds: Partial<TCoursefaculty>,
) => {
  const result = await CourseFaculty.findByIdAndUpdate(
    courseId,
    { $pull: { faculties: { $in: facultyIds } } },
    { new: true, runValidators: true },
  );
  return result;
};

export const CourseServices = {
  createCourseIntoDB,
  getAllCoursesFromDB,
  getSingleCourseFromDB,
  deleteCourseFromDB,
  updateCourseIntoDB,
  assignFacultiesWithCourseIntoDB,
  removeFacultiesFromCourseFromDB,
};
