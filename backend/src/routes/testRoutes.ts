import { Router } from 'express';
import { getTestsByCourse, getStudentGrades, createTest, submitTestResults } from '../controllers/testController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /api/tests/course/{courseId}:
 *   get:
 *     summary: Get tests by course
 *     tags: [Tests]
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
 *         description: List of tests
 */
router.get('/course/:courseId', getTestsByCourse);

/**
 * @swagger
 * /api/tests/grades:
 *   get:
 *     summary: Get student grades
 *     tags: [Tests]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Student test results
 */
router.get('/grades', getStudentGrades);

/**
 * @swagger
 * /api/tests:
 *   post:
 *     summary: Create a new test (Faculty only)
 *     tags: [Tests]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - courseId
 *               - testDate
 *               - maxMarks
 *               - weightage
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               courseId:
 *                 type: string
 *               testDate:
 *                 type: string
 *                 format: date-time
 *               maxMarks:
 *                 type: number
 *               weightage:
 *                 type: number
 *     responses:
 *       201:
 *         description: Test created successfully
 */
router.post('/', authorize('FACULTY', 'ADMIN'), createTest);

/**
 * @swagger
 * /api/tests/results:
 *   post:
 *     summary: Submit test results (Faculty only)
 *     tags: [Tests]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - testId
 *               - results
 *             properties:
 *               testId:
 *                 type: string
 *               results:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     studentId:
 *                       type: string
 *                     marksObtained:
 *                       type: number
 *                     grade:
 *                       type: string
 *                     remarks:
 *                       type: string
 *     responses:
 *       200:
 *         description: Results submitted successfully
 */
router.post('/results', authorize('FACULTY', 'ADMIN'), submitTestResults);

export default router;
