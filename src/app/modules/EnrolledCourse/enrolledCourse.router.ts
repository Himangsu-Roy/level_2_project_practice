import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
import validateRequest from '../../middlewares/validateRequest';
import { EnrolledCourseValidation } from './enrolledCourse.validation';

const router = express.Router();

router.post("/create-enrolled-course", auth(USER_ROLE.student), validateRequest(EnrolledCourseValidation.createEnrolledCourseValidationZodSchema), )