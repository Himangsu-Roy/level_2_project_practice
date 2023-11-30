import { TAcademicFaculty } from './academicFaculty.interface';
import AcademicFaculty from './academicFaculty.model';

const createAcademicFacultyIntoDB = async (payload: TAcademicFaculty) => {
  const academicFaculty = await AcademicFaculty.create(payload);
  return academicFaculty;
};

const getAllAcademicFacultiesFromDB = async () => {
  const academicFaculties = await AcademicFaculty.find();
  return academicFaculties;
};

const getSingleAcademicFacultyFromDB = async (id: string) => {
  const academicFaculty = await AcademicFaculty.findById(id);
  return academicFaculty;
};

const updateAcademicFacultyIntoDB = async (
  id: string,
  payload: TAcademicFaculty,
) => {
  const academicFaculty = await AcademicFaculty.findByIdAndUpdate(
    { _id: id },
    payload,
    {
      new: true,
    },
  );
  return academicFaculty;
};

export const AcademicFacultyService = {
  createAcademicFacultyIntoDB,
  getAllAcademicFacultiesFromDB,
  getSingleAcademicFacultyFromDB,
  updateAcademicFacultyIntoDB,
};
