import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import AcademicSemester from '../academicSemester/academicSemester.model';
import { TSemesterRegistration } from './semesterRegistration.interface';
import { SemesterRegistration } from './semesterRegistration.model';
import { RegistrationStatus } from './semesterRegistration.constant';

const createSemesterRegistrationIntoDB = async (
  payload: TSemesterRegistration,
) => {
  const academicSemester = payload?.academicSemester;

  //check if there any registered semester that is already 'UPCOMING'|'ONGOING'
  const isThereAnyUpcomingOrOngoingSEmester =
    await SemesterRegistration.findOne({
      $or: [
        { status: RegistrationStatus.UPCOMING },
        { status: RegistrationStatus.ONGOING },
      ],
    });

  if (isThereAnyUpcomingOrOngoingSEmester) {
    throw new AppError(
      `There is aready an ${isThereAnyUpcomingOrOngoingSEmester.status} registered semester !`,
      httpStatus.BAD_REQUEST,
    );
  }

  // check if the semester is exist
  const isAcademicSemesterExist =
    await AcademicSemester.findById(academicSemester);

  if (!isAcademicSemesterExist) {
    throw new AppError('Academic semester not found', httpStatus.NOT_FOUND);
  }

  // check if the semester is already registered!
  const isSemesterRegistrationExist = await SemesterRegistration.findOne({
    academicSemester,
  });

  if (isSemesterRegistrationExist) {
    throw new AppError(
      'Semester registration already exist',
      httpStatus.CONFLICT,
    );
  }

  const result = await SemesterRegistration.create(payload);

  return result;
};

const getAllSemesterRegistrationsFromDB = async (
  query: Record<string, unknown>,
) => {
  const semesterRegistrationQuery = new QueryBuilder(
    SemesterRegistration.find().populate('academicSemester'),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .limitFields();

  const result = await semesterRegistrationQuery.modelQuery;
  return result;
};

const getSingleSemesterRegistrationsFromDB = async (id: string) => {
  const result = await SemesterRegistration.findById(id);

  return result;
};

const updateSemesterRegistrationIntoDB = async (
  id: string,
  payload: Partial<TSemesterRegistration>,
) => {
  // check if the requested registered semester is exists
  // check if the semester is already registered!
  const isSemesterRegistrationExist = await SemesterRegistration.findById(id);
  const requestedStatus = payload?.status;
  //   if (requestedStatus === RegistrationStatus.ENDED) {
  //     throw new AppError(
  //       'You cannot end the semester registration that is already ended',
  //       httpStatus.BAD_REQUEST,
  //     );
  //   }

  if (!isSemesterRegistrationExist) {
    throw new AppError('Semester registration not found', httpStatus.NOT_FOUND);
  }
  //if the requested semester registration is ended , we will not update anything

  const currentSemesterStatus = isSemesterRegistrationExist?.status;
  if (currentSemesterStatus === RegistrationStatus.ENDED) {
    throw new AppError(
      'You cannot update the semester registration that is already ended',
      httpStatus.BAD_REQUEST,
    );
  }

  // UPCOMING ==> ONGOING ==> ENDED
  if (
    currentSemesterStatus === RegistrationStatus.UPCOMING &&
    requestedStatus === RegistrationStatus.ENDED
  ) {
    throw new AppError(
      `You can not directly change status from ${currentSemesterStatus} to ${requestedStatus}`,
      httpStatus.BAD_REQUEST,
    );
  }

  if (
    currentSemesterStatus === RegistrationStatus.ONGOING &&
    requestedStatus === RegistrationStatus.UPCOMING
  ) {
    throw new AppError(
      `You can not directly change status from ${currentSemesterStatus} to ${requestedStatus}`,
      httpStatus.BAD_REQUEST,
    );
  }

  const result = await SemesterRegistration.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};

const deleteSemesterRegistrationFromDB = async (id: string) => {
  const result = await SemesterRegistration.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );

  return result;
};

export const SemesterRegistrationService = {
  createSemesterRegistrationIntoDB,
  getAllSemesterRegistrationsFromDB,
  getSingleSemesterRegistrationsFromDB,
  updateSemesterRegistrationIntoDB,
  deleteSemesterRegistrationFromDB,
};
