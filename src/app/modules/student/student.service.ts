import Student from './student.model';
import { TStudent } from './student.interface';

const getAllStudentsFromDB = async () => {
  const result = await Student.find()
    .populate('addmissionSemester')
    .populate({
      path: 'academicDepartment',
      populate: { path: 'academicFaculty' },
    });
  return result;
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
  const result = await Student.updateOne({ id }, { isDeleted: true });
  return result;
};

// update data
const updateStudentFromDB = async (id: string, studentData: TStudent) => {
  const result = await Student.updateOne({ id }, studentData);
  if (result.matchedCount === 0) {
    throw new Error('User not found');
  }
  return result;
};

export const StudentService = {
  // createStudentIntoDB,
  getAllStudentsFromDB,
  getSingleStudentFromDB,
  deleteStudentFromDB,
  updateStudentFromDB,
};
