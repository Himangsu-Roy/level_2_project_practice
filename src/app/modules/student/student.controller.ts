import { NextFunction, Request, Response } from 'express';
import { StudentService } from './student.service';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
// import studentSchema from './student.validation';
// import validateStudentModel from './student.validation';
// import studentValidationSchema from './student.validation';

const getAllStudents = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await StudentService.getAllStudentsFromDB();
    // res.status(200).json({
    //   success: true,
    //   message: 'All students fetched successfully',
    //   data: result,
    // });
     sendResponse(res, {
       statusCode: httpStatus.OK,
       success: true,
       message: 'All students fetched successfully',
       data: result,
     });
  } catch (error) {
    // res.status(400).json({
    //   success: false,
    //   message: 'Student not found',
    //   data: error,
    // });

    next(error);
  }
};

const getSingleStudent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const result = await StudentService.getSingleStudentFromDB(id);
    // res.status(200).json({
    //   success: true,
    //   message: 'One Student fetched successfully',
    //   data: result,
    // });
     sendResponse(res, {
       statusCode: httpStatus.OK,
       success: true,
       message: 'One Student fetched successfully',
       data: result,
     });
  } catch (error) {
    // res.status(400).json({
    //   success: false,
    //   message: 'Student not found',
    //   data: error,
    // });
    next(error);
  }
};

const deleteStudents = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { studentId } = req.params;
    const result = await StudentService.deleteStudentFromDB(studentId);
    // res.status(200).json({
    //   success: true,
    //   message: 'students deleted successfully',
    //   data: result,
    // });
       sendResponse(res, {
         statusCode: httpStatus.OK,
         success: true,
         message: 'students deleted successfully',
         data: result,
       });
  } catch (error) {
    // res.status(400).json({
    //   success: false,
    //   message: 'Student not found',
    //   data: error,
    // });
    next(error);
  }
};

// update student
const updateStudent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const { student } = req.body;
    const result = await StudentService.updateStudentFromDB(id, student);
    // res.status(200).json({
    //   success: true,
    //   message: 'Student updated successfully',
    //   data: result,
    // });
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Student updated successfully',
      data: result,
    });

  } catch (error) {
    // res.status(400).json({
    //   success: false,
    //   message: 'Student not found',
    //   data: error,
    // });

    next(error);
  }
};

export const StudentControllers = {
  // createStudent,
  getAllStudents,
  getSingleStudent,
  deleteStudents,
  updateStudent,
};
