import express from "express";
import { AcademicDepartmentController } from "./academicDepartment.controller";
import validateRequest from "../../middlewares/validateRequest";
const router = express.Router();

router.post('/create-academic-department', validateRequest(), AcademicDepartmentController.createAcademicDepartment)
router.get('/:departmentId', AcademicDepartmentController.getSingleAcademicDepartment)
router.get('/', AcademicDepartmentController.getAllAcademicDepartments)
router.patch('/:departmentId', validateRequest(), AcademicDepartmentController.updateAcademicDepartment)

export const AcademicDepartmentRoutes = router;