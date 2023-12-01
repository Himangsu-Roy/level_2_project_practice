import express from 'express';
import { AcademicDepartmentController } from './academicDepartment.controller';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicDepartmentValidation } from './academicDepartment.validation';
const router = express.Router();

router.post(
  '/create-academic-department',
  validateRequest(
    AcademicDepartmentValidation.updateAcademicDepartmentValidationSchema,
  ),
  AcademicDepartmentController.createAcademicDepartment,
);
router.get(
  '/:departmentId',
  AcademicDepartmentController.getSingleAcademicDepartment,
);
router.get('/', AcademicDepartmentController.getAllAcademicDepartments);
router.patch(
  '/:departmentId',
  validateRequest(
    AcademicDepartmentValidation.updateAcademicDepartmentValidationSchema,
  ),
  AcademicDepartmentController.updateAcademicDepartment,
);

export const AcademicDepartmentRoutes = router;
