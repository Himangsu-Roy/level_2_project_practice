import { StudentService } from './student.service';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
// import studentSchema from './student.validation';
// import validateStudentModel from './student.validation';
// import studentValidationSchema from './student.validation';



const getAllStudents = catchAsync(async (req, res) => {
  const result = await StudentService.getAllStudentsFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All students fetched successfully',
    data: result,
  });
});

const getSingleStudent = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await StudentService.getSingleStudentFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'One Student fetched successfully',
    data: result,
  });
});

const deleteStudents = catchAsync(async (req, res) => {
  const { studentId } = req.params;
  const result = await StudentService.deleteStudentFromDB(studentId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'students deleted successfully',
    data: result,
  });
});

// update student
const updateStudent = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { student } = req.body;
  const result = await StudentService.updateStudentFromDB(id, student);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student updated successfully',
    data: result,
  });
});

export const StudentControllers = {
  // createStudent,
  getAllStudents,
  getSingleStudent,
  deleteStudents,
  updateStudent,
};
