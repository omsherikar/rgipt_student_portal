import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../config/database';
import logger from '../config/logger';

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { role } = req.query;

    const where: any = {};
    if (role) where.role = role;

    const users = await prisma.user.findMany({
      where,
      include: {
        student: true,
        faculty: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ users });
  } catch (error) {
    logger.error('Get all users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, role, firstName, lastName, ...additionalData } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ error: 'User already exists' });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with role-specific data
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
        ...(role === 'STUDENT' && {
          student: {
            create: {
              firstName,
              lastName,
              rollNumber: additionalData.rollNumber,
              dateOfBirth: new Date(additionalData.dateOfBirth),
              phoneNumber: additionalData.phoneNumber,
              address: additionalData.address,
              academicYear: additionalData.academicYear,
              semester: additionalData.semester,
              department: additionalData.department,
              program: additionalData.program,
            },
          },
        }),
        ...(role === 'FACULTY' && {
          faculty: {
            create: {
              firstName,
              lastName,
              employeeId: additionalData.employeeId,
              department: additionalData.department,
              designation: additionalData.designation,
              phoneNumber: additionalData.phoneNumber,
            },
          },
        }),
      },
      include: {
        student: true,
        faculty: true,
      },
    });

    logger.info(`User created by admin: ${email}`);

    res.status(201).json({
      message: 'User created successfully',
      user,
    });
  } catch (error) {
    logger.error('Create user error:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const updateData = req.body;

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        isActive: updateData.isActive,
        ...(updateData.student && {
          student: {
            update: updateData.student,
          },
        }),
        ...(updateData.faculty && {
          faculty: {
            update: updateData.faculty,
          },
        }),
      },
      include: {
        student: true,
        faculty: true,
      },
    });

    logger.info(`User updated by admin: ${userId}`);

    res.json({
      message: 'User updated successfully',
      user,
    });
  } catch (error) {
    logger.error('Update user error:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    await prisma.user.delete({
      where: { id: userId },
    });

    logger.info(`User deleted by admin: ${userId}`);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    logger.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

export const createCourse = async (req: Request, res: Response): Promise<void> => {
  try {
    const { code, name, description, credits, academicYear, semester, department, maxEnrollment, facultyId } = req.body;

    const course = await prisma.course.create({
      data: {
        code,
        name,
        description,
        credits,
        academicYear,
        semester,
        department,
        maxEnrollment,
        facultyId,
      },
    });

    logger.info(`Course created by admin: ${code}`);

    res.status(201).json({
      message: 'Course created successfully',
      course,
    });
  } catch (error) {
    logger.error('Create course error:', error);
    res.status(500).json({ error: 'Failed to create course' });
  }
};

export const updateCourse = async (req: Request, res: Response): Promise<void> => {
  try {
    const { courseId } = req.params;
    const updateData = req.body;

    const course = await prisma.course.update({
      where: { id: courseId },
      data: updateData,
    });

    logger.info(`Course updated by admin: ${courseId}`);

    res.json({
      message: 'Course updated successfully',
      course,
    });
  } catch (error) {
    logger.error('Update course error:', error);
    res.status(500).json({ error: 'Failed to update course' });
  }
};

export const deleteCourse = async (req: Request, res: Response): Promise<void> => {
  try {
    const { courseId } = req.params;

    await prisma.course.delete({
      where: { id: courseId },
    });

    logger.info(`Course deleted by admin: ${courseId}`);

    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    logger.error('Delete course error:', error);
    res.status(500).json({ error: 'Failed to delete course' });
  }
};

export const createFeeRecord = async (req: Request, res: Response): Promise<void> => {
  try {
    const { studentId, academicYear, semester, tuitionFee, hostelFee, libraryFee, labFee, otherFees, dueDate } = req.body;

    const totalAmount = tuitionFee + hostelFee + libraryFee + labFee + otherFees;

    const feeRecord = await prisma.feeRecord.create({
      data: {
        studentId,
        academicYear,
        semester,
        tuitionFee,
        hostelFee,
        libraryFee,
        labFee,
        otherFees,
        totalAmount,
        dueDate: new Date(dueDate),
      },
    });

    logger.info(`Fee record created by admin for student: ${studentId}`);

    res.status(201).json({
      message: 'Fee record created successfully',
      feeRecord,
    });
  } catch (error) {
    logger.error('Create fee record error:', error);
    res.status(500).json({ error: 'Failed to create fee record' });
  }
};

export const getAcademicYears = async (req: Request, res: Response): Promise<void> => {
  try {
    const academicYears = await prisma.academicYear.findMany({
      orderBy: { year: 'desc' },
    });

    res.json({ academicYears });
  } catch (error) {
    logger.error('Get academic years error:', error);
    res.status(500).json({ error: 'Failed to fetch academic years' });
  }
};

export const createAcademicYear = async (req: Request, res: Response): Promise<void> => {
  try {
    const { year, startDate, endDate, isCurrent } = req.body;

    // If setting as current, unset all others
    if (isCurrent) {
      await prisma.academicYear.updateMany({
        where: { isCurrent: true },
        data: { isCurrent: false },
      });
    }

    const academicYear = await prisma.academicYear.create({
      data: {
        year,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        isCurrent,
      },
    });

    logger.info(`Academic year created by admin: ${year}`);

    res.status(201).json({
      message: 'Academic year created successfully',
      academicYear,
    });
  } catch (error) {
    logger.error('Create academic year error:', error);
    res.status(500).json({ error: 'Failed to create academic year' });
  }
};
