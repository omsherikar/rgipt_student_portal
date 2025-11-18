import { Router } from 'express';
import { getStudentProfile, getEnrolledCourses, getAttendanceSummary } from '../controllers/studentController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.use(authenticate);
router.use(authorize('STUDENT'));

/**
 * @swagger
 * /api/students/profile:
 *   get:
 *     summary: Get student profile
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Student profile data
 */
router.get('/profile', getStudentProfile);

/**
 * @swagger
 * /api/students/courses:
 *   get:
 *     summary: Get enrolled courses
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of enrolled courses
 */
router.get('/courses', getEnrolledCourses);

/**
 * @swagger
 * /api/students/attendance:
 *   get:
 *     summary: Get attendance summary
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Attendance summary and records
 */
router.get('/attendance', getAttendanceSummary);

export default router;
