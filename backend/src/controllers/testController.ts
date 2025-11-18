import { Request, Response } from 'express';
import prisma from '../config/database';
import logger from '../config/logger';

export const getTestsByCourse = async (req: Request, res: Response): Promise<void> => {
  try {
    const { courseId } = req.params;

    const tests = await prisma.test.findMany({
      where: { courseId },
      include: {
        course: {
          select: {
            code: true,
            name: true,
          },
        },
        faculty: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { testDate: 'asc' },
    });

    res.json({ tests });
  } catch (error) {
    logger.error('Get tests error:', error);
    res.status(500).json({ error: 'Failed to fetch tests' });
  }
};

export const getStudentGrades = async (req: Request, res: Response): Promise<void> => {
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

    const results = await prisma.testResult.findMany({
      where: { studentId: student.id },
      include: {
        test: {
          include: {
            course: {
              select: {
                code: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        test: {
          testDate: 'desc',
        },
      },
    });

    res.json({ results });
  } catch (error) {
    logger.error('Get student grades error:', error);
    res.status(500).json({ error: 'Failed to fetch grades' });
  }
};

export const createTest = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const faculty = await prisma.faculty.findFirst({
      where: { userId: req.user.userId },
    });

    if (!faculty) {
      res.status(403).json({ error: 'Only faculty can create tests' });
      return;
    }

    const { name, description, courseId, testDate, maxMarks, weightage } = req.body;

    const test = await prisma.test.create({
      data: {
        name,
        description,
        courseId,
        facultyId: faculty.id,
        testDate: new Date(testDate),
        maxMarks,
        weightage,
      },
    });

    logger.info(`Test created: ${name} for course ${courseId}`);

    res.status(201).json({
      message: 'Test created successfully',
      test,
    });
  } catch (error) {
    logger.error('Create test error:', error);
    res.status(500).json({ error: 'Failed to create test' });
  }
};

export const submitTestResults = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const faculty = await prisma.faculty.findFirst({
      where: { userId: req.user.userId },
    });

    if (!faculty) {
      res.status(403).json({ error: 'Only faculty can submit test results' });
      return;
    }

    const { testId, results } = req.body;

    // Verify test belongs to faculty
    const test = await prisma.test.findFirst({
      where: {
        id: testId,
        facultyId: faculty.id,
      },
    });

    if (!test) {
      res.status(404).json({ error: 'Test not found or unauthorized' });
      return;
    }

    // Bulk create/update results
    const resultPromises = results.map((result: any) =>
      prisma.testResult.upsert({
        where: {
          testId_studentId: {
            testId,
            studentId: result.studentId,
          },
        },
        update: {
          marksObtained: result.marksObtained,
          grade: result.grade,
          remarks: result.remarks,
        },
        create: {
          testId,
          studentId: result.studentId,
          marksObtained: result.marksObtained,
          grade: result.grade,
          remarks: result.remarks,
        },
      })
    );

    await Promise.all(resultPromises);

    logger.info(`Test results submitted for test ${testId}`);

    res.json({ message: 'Test results submitted successfully' });
  } catch (error) {
    logger.error('Submit test results error:', error);
    res.status(500).json({ error: 'Failed to submit test results' });
  }
};
