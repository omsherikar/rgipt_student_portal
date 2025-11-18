import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Create Admin User
  const adminPassword = await bcrypt.hash('Admin@123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@rgipt.ac.in' },
    update: {},
    create: {
      email: 'admin@rgipt.ac.in',
      password: adminPassword,
      role: 'ADMIN',
    },
  });
  console.log('Admin user created:', admin.email);

  // Create Faculty Users
  const faculty1Password = await bcrypt.hash('Faculty@123', 10);
  const faculty1 = await prisma.user.upsert({
    where: { email: 'faculty1@rgipt.ac.in' },
    update: {},
    create: {
      email: 'faculty1@rgipt.ac.in',
      password: faculty1Password,
      role: 'FACULTY',
      faculty: {
        create: {
          firstName: 'Dr. Rajesh',
          lastName: 'Kumar',
          employeeId: 'FAC001',
          department: 'Computer Science',
          designation: 'Professor',
          phoneNumber: '+91-9876543210',
        },
      },
    },
  });
  console.log('Faculty user created:', faculty1.email);

  const faculty2Password = await bcrypt.hash('Faculty@123', 10);
  const faculty2 = await prisma.user.upsert({
    where: { email: 'faculty2@rgipt.ac.in' },
    update: {},
    create: {
      email: 'faculty2@rgipt.ac.in',
      password: faculty2Password,
      role: 'FACULTY',
      faculty: {
        create: {
          firstName: 'Dr. Priya',
          lastName: 'Sharma',
          employeeId: 'FAC002',
          department: 'Petroleum Engineering',
          designation: 'Associate Professor',
          phoneNumber: '+91-9876543211',
        },
      },
    },
  });
  console.log('Faculty user created:', faculty2.email);

  // Get faculty IDs
  const facultyRecords = await prisma.faculty.findMany();
  const faculty1Record = facultyRecords.find(f => f.employeeId === 'FAC001')!;
  const faculty2Record = facultyRecords.find(f => f.employeeId === 'FAC002')!;

  // Create Student Users
  const students = [];
  for (let i = 1; i <= 10; i++) {
    const studentPassword = await bcrypt.hash('Student@123', 10);
    const student = await prisma.user.upsert({
      where: { email: `student${i}@rgipt.ac.in` },
      update: {},
      create: {
        email: `student${i}@rgipt.ac.in`,
        password: studentPassword,
        role: 'STUDENT',
        student: {
          create: {
            firstName: `Student${i}`,
            lastName: `Test`,
            rollNumber: `20CS10${i.toString().padStart(2, '0')}`,
            dateOfBirth: new Date('2002-01-15'),
            phoneNumber: `+91-987654${i.toString().padStart(4, '0')}`,
            address: `${i} Student Street, Campus, RGIPT`,
            academicYear: i <= 5 ? 1 : 2,
            semester: i <= 5 ? 1 : 3,
            department: 'Computer Science',
            program: 'B.Tech',
          },
        },
      },
    });
    students.push(student);
    console.log('Student user created:', student.email);
  }

  // Create Academic Year
  const academicYear = await prisma.academicYear.upsert({
    where: { year: 2024 },
    update: {},
    create: {
      year: 2024,
      startDate: new Date('2024-07-01'),
      endDate: new Date('2025-06-30'),
      isCurrent: true,
    },
  });
  console.log('Academic year created:', academicYear.year);

  // Create Courses
  const course1 = await prisma.course.upsert({
    where: { code: 'CS101' },
    update: {},
    create: {
      code: 'CS101',
      name: 'Introduction to Programming',
      description: 'Basic programming concepts using Python',
      credits: 4,
      academicYear: 1,
      semester: 1,
      department: 'Computer Science',
      maxEnrollment: 60,
      facultyId: faculty1Record.id,
    },
  });
  console.log('Course created:', course1.code);

  const course2 = await prisma.course.upsert({
    where: { code: 'CS102' },
    update: {},
    create: {
      code: 'CS102',
      name: 'Data Structures and Algorithms',
      description: 'Fundamental data structures and algorithms',
      credits: 4,
      academicYear: 1,
      semester: 2,
      department: 'Computer Science',
      maxEnrollment: 60,
      facultyId: faculty1Record.id,
    },
  });
  console.log('Course created:', course2.code);

  const course3 = await prisma.course.upsert({
    where: { code: 'PE101' },
    update: {},
    create: {
      code: 'PE101',
      name: 'Introduction to Petroleum Engineering',
      description: 'Basics of petroleum engineering',
      credits: 3,
      academicYear: 2,
      semester: 3,
      department: 'Petroleum Engineering',
      maxEnrollment: 50,
      facultyId: faculty2Record.id,
    },
  });
  console.log('Course created:', course3.code);

  const course4 = await prisma.course.upsert({
    where: { code: 'CS201' },
    update: {},
    create: {
      code: 'CS201',
      name: 'Database Management Systems',
      description: 'Relational databases and SQL',
      credits: 4,
      academicYear: 2,
      semester: 3,
      department: 'Computer Science',
      maxEnrollment: 60,
      facultyId: faculty1Record.id,
    },
  });
  console.log('Course created:', course4.code);

  // Get student records
  const studentRecords = await prisma.student.findMany();

  // Enroll students in courses
  for (const studentRecord of studentRecords) {
    const courses = studentRecord.academicYear === 1 && studentRecord.semester === 1
      ? [course1]
      : studentRecord.academicYear === 2 && studentRecord.semester === 3
      ? [course3, course4]
      : [];

    for (const course of courses) {
      await prisma.enrollment.upsert({
        where: {
          studentId_courseId: {
            studentId: studentRecord.id,
            courseId: course.id,
          },
        },
        update: {},
        create: {
          studentId: studentRecord.id,
          courseId: course.id,
          status: 'ACTIVE',
        },
      });
      console.log(`Enrolled ${studentRecord.rollNumber} in ${course.code}`);
    }
  }

  // Create Tests
  const test1 = await prisma.test.upsert({
    where: { id: 'test1-seed' },
    update: {},
    create: {
      id: 'test1-seed',
      name: 'Mid-Term Exam',
      description: 'Mid-term examination for CS101',
      courseId: course1.id,
      facultyId: faculty1Record.id,
      testDate: new Date('2024-10-15'),
      maxMarks: 100,
      weightage: 30,
    },
  });
  console.log('Test created:', test1.name);

  const test2 = await prisma.test.upsert({
    where: { id: 'test2-seed' },
    update: {},
    create: {
      id: 'test2-seed',
      name: 'Quiz 1',
      description: 'First quiz for CS101',
      courseId: course1.id,
      facultyId: faculty1Record.id,
      testDate: new Date('2024-09-01'),
      maxMarks: 20,
      weightage: 10,
    },
  });
  console.log('Test created:', test2.name);

  // Create Test Results
  const year1Sem1Students = studentRecords.filter(s => s.academicYear === 1 && s.semester === 1);
  for (const student of year1Sem1Students) {
    // Mid-term results
    await prisma.testResult.upsert({
      where: {
        testId_studentId: {
          testId: test1.id,
          studentId: student.id,
        },
      },
      update: {},
      create: {
        testId: test1.id,
        studentId: student.id,
        marksObtained: 70 + Math.random() * 25,
        grade: 'A',
      },
    });

    // Quiz results
    await prisma.testResult.upsert({
      where: {
        testId_studentId: {
          testId: test2.id,
          studentId: student.id,
        },
      },
      update: {},
      create: {
        testId: test2.id,
        studentId: student.id,
        marksObtained: 15 + Math.random() * 5,
        grade: 'A+',
      },
    });
  }
  console.log('Test results created for students');

  // Create Attendance Records
  const attendanceDates = [
    new Date('2024-08-01'),
    new Date('2024-08-05'),
    new Date('2024-08-10'),
    new Date('2024-08-15'),
    new Date('2024-08-20'),
  ];

  for (const student of year1Sem1Students) {
    for (const date of attendanceDates) {
      await prisma.attendance.upsert({
        where: {
          studentId_courseId_date: {
            studentId: student.id,
            courseId: course1.id,
            date,
          },
        },
        update: {},
        create: {
          studentId: student.id,
          courseId: course1.id,
          date,
          status: Math.random() > 0.1 ? 'PRESENT' : 'ABSENT',
        },
      });
    }
  }
  console.log('Attendance records created');

  // Create Fee Records
  for (const student of studentRecords) {
    await prisma.feeRecord.upsert({
      where: {
        id: `fee-${student.id}-${student.academicYear}-${student.semester}`,
      },
      update: {},
      create: {
        id: `fee-${student.id}-${student.academicYear}-${student.semester}`,
        studentId: student.id,
        academicYear: student.academicYear,
        semester: student.semester,
        tuitionFee: 50000,
        hostelFee: 15000,
        libraryFee: 2000,
        labFee: 3000,
        otherFees: 1000,
        totalAmount: 71000,
        dueDate: new Date('2024-08-31'),
      },
    });
  }
  console.log('Fee records created');

  // Create sample payments for some students
  const firstStudent = studentRecords[0];
  const feeRecord = await prisma.feeRecord.findFirst({
    where: { studentId: firstStudent.id },
  });

  if (feeRecord) {
    await prisma.payment.upsert({
      where: { id: 'payment-seed-1' },
      update: {},
      create: {
        id: 'payment-seed-1',
        feeRecordId: feeRecord.id,
        studentId: firstStudent.id,
        amount: 71000,
        paymentMethod: 'UPI',
        transactionId: 'TXN123456789',
        receiptNumber: 'RCP2024001',
        status: 'COMPLETED',
        paymentDate: new Date('2024-08-15'),
      },
    });
  }
  console.log('Sample payment created');

  // Create Notifications
  for (const student of students.slice(0, 3)) {
    const studentRecord = await prisma.student.findFirst({
      where: { userId: student.id },
    });
    if (studentRecord) {
      await prisma.notification.create({
        data: {
          userId: student.id,
          title: 'Welcome to RGIPT Student Hub',
          message: 'Your account has been successfully created.',
          type: 'SUCCESS',
        },
      });
    }
  }
  console.log('Notifications created');

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
