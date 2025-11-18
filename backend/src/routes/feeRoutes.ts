import { Router } from 'express';
import { getStudentFees, makePayment, getPaymentHistory, getPaymentReceipt } from '../controllers/feeController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.use(authenticate);
router.use(authorize('STUDENT'));

/**
 * @swagger
 * /api/fees:
 *   get:
 *     summary: Get student fee records
 *     tags: [Fees]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of fee records
 */
router.get('/', getStudentFees);

/**
 * @swagger
 * /api/fees/payment:
 *   post:
 *     summary: Make a payment
 *     tags: [Fees]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - feeRecordId
 *               - amount
 *               - paymentMethod
 *             properties:
 *               feeRecordId:
 *                 type: string
 *               amount:
 *                 type: number
 *               paymentMethod:
 *                 type: string
 *                 enum: [CARD, UPI, NET_BANKING, CASH]
 *     responses:
 *       201:
 *         description: Payment processed successfully
 */
router.post('/payment', makePayment);

/**
 * @swagger
 * /api/fees/payments:
 *   get:
 *     summary: Get payment history
 *     tags: [Fees]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Payment history
 */
router.get('/payments', getPaymentHistory);

/**
 * @swagger
 * /api/fees/receipt/{paymentId}:
 *   get:
 *     summary: Get payment receipt
 *     tags: [Fees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: paymentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Payment receipt details
 */
router.get('/receipt/:paymentId', getPaymentReceipt);

export default router;
