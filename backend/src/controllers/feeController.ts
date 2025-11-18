import { Request, Response } from 'express';
import prisma from '../config/database';
import logger from '../config/logger';

export const getStudentFees = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const student = await prisma.student.findFirst({
      where: { userId: req.user.userId },
    });

    if (!student) {
      res.status(404).json({ error: 'Student not found' });
      return;
    }

    const feeRecords = await prisma.feeRecord.findMany({
      where: { studentId: student.id },
      include: {
        payments: {
          orderBy: { paymentDate: 'desc' },
        },
      },
      orderBy: [
        { academicYear: 'desc' },
        { semester: 'desc' },
      ],
    });

    res.json({ feeRecords });
  } catch (error) {
    logger.error('Get student fees error:', error);
    res.status(500).json({ error: 'Failed to fetch fee records' });
  }
};

export const makePayment = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const student = await prisma.student.findFirst({
      where: { userId: req.user.userId },
    });

    if (!student) {
      res.status(404).json({ error: 'Student not found' });
      return;
    }

    const { feeRecordId, amount, paymentMethod } = req.body;

    // Verify fee record belongs to student
    const feeRecord = await prisma.feeRecord.findFirst({
      where: {
        id: feeRecordId,
        studentId: student.id,
      },
    });

    if (!feeRecord) {
      res.status(404).json({ error: 'Fee record not found' });
      return;
    }

    // Simulate payment processing (stub integration)
    const transactionId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
    const receiptNumber = `RCP${Date.now()}`;

    const payment = await prisma.payment.create({
      data: {
        feeRecordId,
        studentId: student.id,
        amount,
        paymentMethod,
        transactionId,
        receiptNumber,
        status: 'COMPLETED', // In real app, would be PENDING initially
      },
    });

    logger.info(`Payment made: ${transactionId} by student ${student.rollNumber}`);

    res.status(201).json({
      message: 'Payment processed successfully',
      payment,
    });
  } catch (error) {
    logger.error('Make payment error:', error);
    res.status(500).json({ error: 'Failed to process payment' });
  }
};

export const getPaymentHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const student = await prisma.student.findFirst({
      where: { userId: req.user.userId },
    });

    if (!student) {
      res.status(404).json({ error: 'Student not found' });
      return;
    }

    const payments = await prisma.payment.findMany({
      where: { studentId: student.id },
      include: {
        feeRecord: {
          select: {
            academicYear: true,
            semester: true,
            totalAmount: true,
          },
        },
      },
      orderBy: { paymentDate: 'desc' },
    });

    res.json({ payments });
  } catch (error) {
    logger.error('Get payment history error:', error);
    res.status(500).json({ error: 'Failed to fetch payment history' });
  }
};

export const getPaymentReceipt = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { paymentId } = req.params;

    const student = await prisma.student.findFirst({
      where: { userId: req.user.userId },
    });

    if (!student) {
      res.status(404).json({ error: 'Student not found' });
      return;
    }

    const payment = await prisma.payment.findFirst({
      where: {
        id: paymentId,
        studentId: student.id,
      },
      include: {
        feeRecord: true,
        student: {
          select: {
            firstName: true,
            lastName: true,
            rollNumber: true,
            department: true,
            program: true,
          },
        },
      },
    });

    if (!payment) {
      res.status(404).json({ error: 'Payment not found' });
      return;
    }

    res.json({ payment });
  } catch (error) {
    logger.error('Get payment receipt error:', error);
    res.status(500).json({ error: 'Failed to fetch payment receipt' });
  }
};
