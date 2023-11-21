import { Request, Response } from 'express';
import { StudentService } from './student.service';
// import studentSchema from './student.validation';
// import validateStudentModel from './student.validation';
import studentValidationSchema from './student.validation';

const createStudent = async (req: Request, res: Response) => {
  try {
    // creating a schema validation using zod

    const { student: studentData } = req.body;

    //data validation using zod
    const studentValidateData = studentValidationSchema.parse(studentData);
    console.log(studentValidateData);

    // creating a validation schema for joi
    // data validation using joi
    // const { error, value } = studentSchema.validate(studentData);

    // will call service function to send this data
    const result =
      await StudentService.createStudentIntoDB(studentValidateData);

    // console.log(error, value);
    // if (error) {
    //   res.status(400).json({
    //     success: false,
    //     message: error.message,
    //     // message: 'Student not created',
    //     data: error.details,
    //   });
    // }

    res.status(200).json({
      success: true,
      message: 'Student created successfully',
      data: result,
    });
  } catch (error: any) {
    //   console.log(error);
    res.status(400).json({
      success: false,
      message: error.message || 'Student not created',
      data: error,
    });
  }
};

const getAllStudents = async (req: Request, res: Response) => {
  try {
    const result = await StudentService.getAllStudentsFromDB();
    res.status(200).json({
      success: true,
      message: 'All students fetched successfully',
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Student not found',
      data: error,
    });

    console.log(error);
  }
};

const getSingleStudent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await StudentService.getSingleStudentFromDB(id);
    res.status(200).json({
      success: true,
      message: 'One Student fetched successfully',
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Student not found',
      data: error,
    });

    console.log(error);
  }
};

const deleteStudents = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const result = await StudentService.deleteStudentFromDB(studentId);
    res.status(200).json({
      success: true,
      message: 'students deleted successfully',
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Student not found',
      data: error,
    });

    console.log(error);
  }
};

// update student
const updateStudent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { student } = req.body;
    const result = await StudentService.updateStudentFromDB(id, student);
    res.status(200).json({
      success: true,
      message: 'Student updated successfully',
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Student not found',
      data: error,
    });

    console.log(error);
  }
};

export const StudentControllers = {
  createStudent,
  getAllStudents,
  getSingleStudent,
  deleteStudents,
  updateStudent,
};
