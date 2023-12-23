import { UserServices } from './user.service';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';

const createStudent = catchAsync(async (req, res) => {
  // creating a schema validation using zod
  const { password, student: studentData } = req.body;

  // will call service function to send this data
  const result = await UserServices.createStudentIntoDB(
    req.file,
    password,
    studentData,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student created successfully',
    data: result,
  });
});

const createFaculty = catchAsync(async (req, res) => {
  // creating a schema validation using zod
  const { password, faculty: facultyData } = req.body;

  // will call service function to send this data
  const result = await UserServices.createFacultyIntoDB(password, facultyData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculty created successfully',
    data: result,
  });
});

const createAdmin = catchAsync(async (req, res) => {
  // creating a schema validation using zod
  const { password, admin: adminData } = req.body;

  // will call service function to send this data
  const result = await UserServices.createAdminIntoDB(
    req?.file,
    password,
    adminData,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin created successfully',
    data: result,
  });
});

const changeStatus = catchAsync(async (req, res) => {
  // creating a schema validation using zod
  const { id } = req.params;
  const { status } = req.body;

  // will call service function to send this data
  const result = await UserServices.changeStatus(id, status);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Status changed successfully',
    data: result,
  });
});

const getMe = catchAsync(async (req, res) => {
  // const id = req.params.id;
  const {userId, role} = req.user
  const result = await UserServices.getMe(userId, role);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User fetched successfully',
    data: result,
  });
});

export const UserControllers = {
  createStudent,
  createAdmin,
  createFaculty,
  changeStatus,
  getMe,
};
