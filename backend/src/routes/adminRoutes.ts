import { Router } from 'express';
import { 
  getAllUsers, 
  createUser, 
  updateUser, 
  deleteUser,
  createCourse,
  updateCourse,
  deleteCourse,
  createFeeRecord,
  getAcademicYears,
  createAcademicYear
} from '../controllers/adminController';
import { authenticate, authorize } from '../middleware/auth';
import { adminLimiter } from '../middleware/rateLimiter';

const router = Router();

router.use(authenticate);
router.use(authorize('ADMIN'));
router.use(adminLimiter);

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [STUDENT, FACULTY, ADMIN]
 *     responses:
 *       200:
 *         description: List of users
 */
router.get('/users', getAllUsers);

/**
 * @swagger
 * /api/admin/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: User created successfully
 */
router.post('/users', createUser);

/**
 * @swagger
 * /api/admin/users/{userId}:
 *   put:
 *     summary: Update user
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 */
router.put('/users/:userId', updateUser);

/**
 * @swagger
 * /api/admin/users/{userId}:
 *   delete:
 *     summary: Delete user
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 */
router.delete('/users/:userId', deleteUser);

/**
 * @swagger
 * /api/admin/courses:
 *   post:
 *     summary: Create a new course
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Course created successfully
 */
router.post('/courses', createCourse);

/**
 * @swagger
 * /api/admin/courses/{courseId}:
 *   put:
 *     summary: Update course
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Course updated successfully
 */
router.put('/courses/:courseId', updateCourse);

/**
 * @swagger
 * /api/admin/courses/{courseId}:
 *   delete:
 *     summary: Delete course
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Course deleted successfully
 */
router.delete('/courses/:courseId', deleteCourse);

/**
 * @swagger
 * /api/admin/fees:
 *   post:
 *     summary: Create fee record
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Fee record created successfully
 */
router.post('/fees', createFeeRecord);

/**
 * @swagger
 * /api/admin/academic-years:
 *   get:
 *     summary: Get all academic years
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of academic years
 */
router.get('/academic-years', getAcademicYears);

/**
 * @swagger
 * /api/admin/academic-years:
 *   post:
 *     summary: Create academic year
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Academic year created successfully
 */
router.post('/academic-years', createAcademicYear);

export default router;
