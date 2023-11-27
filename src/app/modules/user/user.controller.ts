import { NextFunction, Request, Response } from 'express';
import { UserServices } from './user.service';
import sendResponse from '../../utils/sendResponse';
import  httpStatus  from 'http-status';

const createStudent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // creating a schema validation using zod

    const { password, student: studentData } = req.body;

    //data validation using zod
    // const studentValidateData = studentValidationSchema.parse(studentData);
    // console.log(studentValidateData);

    // creating a validation schema for joi
    // data validation using joi
    // const { error, value } = studentSchema.validate(studentData);

    // will call service function to send this data
    const result = await UserServices.createStudentIntoDB(
      password,
      studentData,
    );

    // console.log(error, value);
    // if (error) {
    //   res.status(400).json({
    //     success: false,
    //     message: error.message,
    //     // message: 'Student not created',
    //     data: error.details,
    //   });
    // }

    // res.status(200).json({
    //   success: true,
    //   message: 'Student created successfully',
    //   data: result,
    // });
    sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Student created successfully', data: result, });
  } catch (error) {
    //   console.log(error);
    // res.status(400).json({
    //   success: false,
    //   message: error.message || 'Student not created',
    //   data: error,
    // });
    next(error);
  }
};

export const UserControllers = {
  createStudent,
};
