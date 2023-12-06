import Student from './student.model';
import { TStudent } from './student.interface';
import mongoose from 'mongoose';
import User from '../user/user.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const getAllStudentsFromDB = async (query: Record<string, unknown>) => {
  console.log(query);
  const queryObj = { ...query }; // copy query

  const studentSearchableFields = ['email', 'name.firstNae', 'presentAddress'];

  let searchTerm = '';

  if (query?.searchTerm) {
    searchTerm = query?.searchTerm as string;
  }

  const searchQuery = Student.find({
    $or: studentSearchableFields.map((field) => ({
      [field]: { $regex: searchTerm, $options: 'i' },
    })),
  });

  // filtering for exclude
  const excludeFields = ['serarchTerm', 'sort', 'limit', 'page', 'fields'];
  excludeFields.forEach((field) => delete queryObj[field]);

  console.log(queryObj);

  const filterQuery = searchQuery
    .find(queryObj)
    .populate('addmissionSemester')
    .populate({
      path: 'academicDepartment',
      populate: { path: 'academicFaculty' },
    });

  let sort = '-createdAt';
  if (query.sort) {
    sort = query.sort as string;
  }

  const sortQuery = filterQuery.sort(sort);

  let page = 1;
  let limit = 1;
  let skip = 0;

  if (query.limit) {
    limit = query.limit as number;
  }

  if (query.page) {
    page = query.page as number;
    skip = (page - 1) * limit;
  }

  const paginateQuery = sortQuery.skip(skip);

  const limitedQuery = paginateQuery.limit(limit);

  let fields = '-__v';
  if (query.fields) {
    fields = (query.fields as string).split(',').join(' ');
    console.log(fields);
  }
  const limitedFieldsQuery = await limitedQuery.select(fields);

  return limitedFieldsQuery;
};

const getSingleStudentFromDB = async (id: string) => {
  // const result = await Student.findOne({ id });
  // const result = await Student.aggregate([{ $match: { id: id } }]);
  const result = await Student.findOne({ id })
    .populate('addmissionSemester')
    .populate({
      path: 'academicDepartment',
      populate: { path: 'academicFaculty' },
    });
  return result;
};

const deleteStudentFromDB = async (id: string) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const deletedStudent = await Student.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session },
    );
    if (!deletedStudent) {
      throw new AppError('Student not found', httpStatus.BAD_REQUEST);
    }
    const deletedUser = await User.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session },
    );
    if (!deletedUser) {
      throw new AppError('User not found', httpStatus.BAD_REQUEST);
    }

    await session.commitTransaction();
    await session.endSession();
    return deletedStudent;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError('Unable to delete student', httpStatus.BAD_REQUEST);
  }
};

// update data
const updateStudentIntoDB = async (
  id: string,
  studentData: Partial<TStudent>,
) => {
  const { name, guardian, localGuardian, ...remainingStudentData } =
    studentData;

  const modifiedStudentData: Record<string, unknown> = {
    ...remainingStudentData,
  };

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedStudentData[`name.${key}`] = value;
    }
  }

  if (guardian && Object.keys(guardian).length) {
    for (const [key, value] of Object.entries(guardian)) {
      modifiedStudentData[`guardian.${key}`] = value;
    }
  }

  if (localGuardian && Object.keys(localGuardian).length) {
    for (const [key, value] of Object.entries(localGuardian)) {
      modifiedStudentData[`localGuardian.${key}`] = value;
    }
  }

  console.log(modifiedStudentData);

  const result = await Student.findOneAndUpdate({ id }, studentData, {
    new: true,
    runValidators: true,
    context: 'query',
  });

  if (!result) {
    throw new AppError('Student not found', httpStatus.BAD_REQUEST);
  }

  return result;
};

export const StudentService = {
  // createStudentIntoDB,
  getAllStudentsFromDB,
  getSingleStudentFromDB,
  deleteStudentFromDB,
  updateStudentIntoDB,
};
