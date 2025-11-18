import { Request, Response } from 'express';
import prisma from '../config/database';
import logger from '../config/logger';

export const getAllCourses = async (req: Request, res: Response): Promise<void> => {
  try {
    const { academicYear, semester, department } = req.query;

    const where: any = {};
    if (academicYear) where.academicYear = parseInt(academicYear as string);
    if (semester) where.semester = parseInt(semester as string);
    if (department) where.department = department;

    const courses = await prisma.course.findMany({
      where,
      include: {
        faculty: {
          select: {
            firstName: true,
            lastName: true,
            designation: true,
          },
        },
        _count: {
          select: {
            enrollments: true,
          },
        },
      },
      orderBy: { code: 'asc' },
    });

    res.json({ courses });
  } catch (error) {
    logger.error('Get courses error:', error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
};

export const getCourseDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        faculty: {
          select: {
            firstName: true,
            lastName: true,
            designation: true,
            department: true,
          },
        },
        tests: {
          select: {
            id: true,
            name: true,
            testDate: true,
            maxMarks: true,
            weightage: true,
          },
          orderBy: { testDate: 'asc' },
        },
        _count: {
          select: {
            enrollments: true,
          },
        },
      },
    });

    if (!course) {
      res.status(404).json({ error: 'Course not found' });
      return;
    }

    res.json({ course });
  } catch (error) {
    logger.error('Get course details error:', error);
    res.status(500).json({ error: 'Failed to fetch course details' });
  }
};

export const enrollCourse = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { courseId } = req.body;

    const student = await prisma.student.findFirst({
      where: { userId: req.user.userId },
    });

    if (!student) {
      res.status(404).json({ error: 'Student not found' });
      return;
    }

    // Check if already enrolled
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId: student.id,
          courseId,
        },
      },
    });

    if (existingEnrollment) {
      res.status(400).json({ error: 'Already enrolled in this course' });
      return;
    }

    // Check course capacity
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        _count: {
          select: { enrollments: true },
        },
      },
    });

    if (!course) {
      res.status(404).json({ error: 'Course not found' });
      return;
    }

    if (course._count.enrollments >= course.maxEnrollment) {
      res.status(400).json({ error: 'Course is full' });
      return;
    }

    const enrollment = await prisma.enrollment.create({
      data: {
        studentId: student.id,
        courseId,
      },
      include: {
        course: true,
      },
    });

    logger.info(`Student ${student.rollNumber} enrolled in course ${course.code}`);

    res.status(201).json({
      message: 'Enrolled successfully',
      enrollment,
    });
  } catch (error) {
    logger.error('Enroll course error:', error);
    res.status(500).json({ error: 'Failed to enroll in course' });
  }
};

export const unenrollCourse = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { courseId } = req.params;

    const student = await prisma.student.findFirst({
      where: { userId: req.user.userId },
    });

    if (!student) {
      res.status(404).json({ error: 'Student not found' });
      return;
    }

    const enrollment = await prisma.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId: student.id,
          courseId,
        },
      },
    });

    if (!enrollment) {
      res.status(404).json({ error: 'Enrollment not found' });
      return;
    }

    await prisma.enrollment.update({
      where: { id: enrollment.id },
      data: { status: 'DROPPED' },
    });

    logger.info(`Student ${student.rollNumber} unenrolled from course ${courseId}`);

    res.json({ message: 'Unenrolled successfully' });
  } catch (error) {
    logger.error('Unenroll course error:', error);
    res.status(500).json({ error: 'Failed to unenroll from course' });
  }
};
