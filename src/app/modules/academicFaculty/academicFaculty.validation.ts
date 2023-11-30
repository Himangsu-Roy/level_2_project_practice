import { z } from 'zod';

const academicFacultyValidationSchema = z.object({
  name: z.string({invalid_type_error: 'Academic faculty must be string', required_error: 'Name is required'}).min(2, {message: 'Name must be at least 2 characters long'}).optional(),
});

export const AcademicFacultyValidation = {
  academicFacultyValidationSchema,
};
