import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { AcademicFacultyController } from "./academicFaculty.controller";
import { AcademicFacultyValidation } from "./academicFaculty.validation";

const router = express.Router();


router.post("/create-academic-faculty", validateRequest(AcademicFacultyValidation.updateAcademicFacultyValidationSchema), AcademicFacultyController.createAcademicFaculty)

router.get("/:facultyId", AcademicFacultyController.getSingleAcademicFaculty)

router.get("/", AcademicFacultyController.getAllAcademicFaculties)

router.patch("/:facultyId", validateRequest(AcademicFacultyValidation.updateAcademicFacultyValidationSchema), AcademicFacultyController.updateAcademicFaculty)

export const AcademicFacultyRoutes = router;