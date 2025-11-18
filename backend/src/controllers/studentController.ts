import { Request, Response } from 'express';
import prisma from '../config/database';
import logger from '../config/logger';

export const getStudentProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const student = await prisma.student.findFirst({
      where: { userId: req.user.userId },
      include: {
        user: {
          select: {
            email: true,
            role: true,
          },
        },
      },
    });

    if (!student) {
      res.status(404).json({ error: 'Student not found' });
      return;
    }

    res.json({ student });
  } catch (error) {
    logger.error('Get student profile error:', error);
    res.status(500).json({ error: 'Failed to fetch student profile' });
  }
};

export const getEnrolledCourses = async (req: Request, res: Response): Promise<void> => {
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

    const enrollments = await prisma.enrollment.findMany({
      where: {
        studentId: student.id,
        status: 'ACTIVE',
      },
      include: {
        course: {
          include: {
            faculty: {
              select: {
                firstName: true,
                lastName: true,
                designation: true,
              },
            },
          },
        },
      },
    });

    res.json({ enrollments });
  } catch (error) {
    logger.error('Get enrolled courses error:', error);
    res.status(500).json({ error: 'Failed to fetch enrolled courses' });
  }
};

export const getAttendanceSummary = async (req: Request, res: Response): Promise<void> => {
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

    const attendances = await prisma.attendance.findMany({
      where: { studentId: student.id },
      include: {
        course: {
          select: {
            code: true,
            name: true,
          },
        },
      },
      orderBy: { date: 'desc' },
    });

    // Calculate summary
    const summary = attendances.reduce((acc, att) => {
      const courseKey = att.course.code;
      if (!acc[courseKey]) {
        acc[courseKey] = {
          courseName: att.course.name,
          courseCode: att.course.code,
          total: 0,
          present: 0,
          absent: 0,
          late: 0,
          excused: 0,
        };
      }
      acc[courseKey].total++;
      acc[courseKey][att.status.toLowerCase() as keyof typeof acc[typeof courseKey]]++;
      return acc;
    }, {} as Record<string, any>);

    res.json({ 
      attendances,
      summary: Object.values(summary),
    });
  } catch (error) {
    logger.error('Get attendance summary error:', error);
    res.status(500).json({ error: 'Failed to fetch attendance summary' });
  }
};
