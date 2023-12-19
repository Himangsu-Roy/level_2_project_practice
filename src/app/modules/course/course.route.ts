import express from 'express';
import { CourseController } from './courser.controller';
import validateRequest from '../../middlewares/validateRequest';
import { CourseValidations } from './course.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.post(
  '/create-course',
  auth(USER_ROLE.admin),
  validateRequest(CourseValidations.createCourseValidationSchema),
  CourseController.createCourse,
);

router.get('/', CourseController.getAllCourses);

router.get('/:id', CourseController.getSingleCourse);

router.delete('/:id', CourseController.deleteCourse);

router.patch(
  '/:id',
  validateRequest(CourseValidations.updateCourseValidationSchema),
  CourseController.updateCourse,
);

router.put(
  '/:courseId/assing-faculties',
  validateRequest(CourseValidations.facultiesWithCourseValidationSchema),
  CourseController.assignFacultiesWithCourse,
);

router.delete(
  '/:courseId/remove-faculties',
  validateRequest(CourseValidations.facultiesWithCourseValidationSchema),
  CourseController.removeFacultiesFromCourse,
);

export const CourseRoutes = router;
