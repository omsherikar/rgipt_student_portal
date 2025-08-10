const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: ".env.local" });

const User = require("../src/models/User").default;
const Course = require("../src/models/Course").default;
const Enrollment = require("../src/models/Enrollment").default;
const Result = require("../src/models/Result").default;
const Attendance = require("../src/models/Attendance").default;
const ClassSchedule = require("../src/models/ClassSchedule").default;
const ExamSchedule = require("../src/models/ExamSchedule").default;
const Document = require("../src/models/Document").default;
const CourseFeedback = require("../src/models/CourseFeedback").default;
const GeneralFeedback = require("../src/models/GeneralFeedback").default;
const Notice = require("../src/models/Notice").default;

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);

  // 1. User
  const user = await User.findOneAndUpdate(
    { email: "your_email@rgipt.ac.in" },
    {
      name: "Aman Sharma",
      department: "Chemical Engineering",
      semester: "4",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    { upsert: true, new: true }
  );

  // 2. Courses
  const courses = await Course.insertMany([
    { code: "CH101", name: "Chemical Process Calculations", semester: "4", credits: 4 },
    { code: "CH102", name: "Fluid Mechanics", semester: "4", credits: 3 },
    { code: "CH103", name: "Heat Transfer", semester: "4", credits: 3 },
  ]);

  // 3. Enrollments
  await Enrollment.insertMany([
    { userId: user._id, courseId: courses[0]._id, semester: "4", grade: "A" },
    { userId: user._id, courseId: courses[1]._id, semester: "4", grade: "B+" },
    { userId: user._id, courseId: courses[2]._id, semester: "4", grade: "A-" },
  ]);

  // 4. Results
  await Result.create({
    userId: user._id,
    semester: "4",
    cpi: 8.7,
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  });

  // 5. Attendance
  const today = new Date();
  for (let i = 0; i < 10; i++) {
    for (const course of courses) {
      await Attendance.create({
        userId: user._id,
        courseId: course._id,
        date: new Date(today.getTime() - i * 86400000),
        status: i % 3 === 0 ? "absent" : "present",
      });
    }
  }

  // 6. Timetable
  await ClassSchedule.insertMany([
    { department: "Chemical Engineering", semester: "4", dayOfWeek: 1, startTime: "09:00", endTime: "10:00", courseId: courses[0]._id, location: "Room 101" },
    { department: "Chemical Engineering", semester: "4", dayOfWeek: 2, startTime: "10:00", endTime: "11:00", courseId: courses[1]._id, location: "Room 102" },
    { department: "Chemical Engineering", semester: "4", dayOfWeek: 3, startTime: "11:00", endTime: "12:00", courseId: courses[2]._id, location: "Room 103" },
  ]);
  await ExamSchedule.insertMany([
    { department: "Chemical Engineering", semester: "4", courseId: courses[0]._id, date: new Date(today.getTime() + 7 * 86400000), startTime: "09:00", endTime: "12:00", location: "Exam Hall 1" },
    { department: "Chemical Engineering", semester: "4", courseId: courses[1]._id, date: new Date(today.getTime() + 10 * 86400000), startTime: "14:00", endTime: "17:00", location: "Exam Hall 2" },
  ]);

  // 7. Documents
  await Document.insertMany([
    { userId: user._id, type: "Bonafide", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" },
    { userId: user._id, type: "ID Card", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" },
  ]);

  // 8. Feedback
  await CourseFeedback.insertMany([
    { userId: user._id, courseId: courses[0]._id, feedback: "Great course!" },
    { userId: user._id, courseId: courses[1]._id, feedback: "Challenging but rewarding." },
  ]);
  await GeneralFeedback.insertMany([
    { userId: user._id, type: "complaint", message: "WiFi is slow in the hostel." },
    { userId: user._id, type: "suggestion", message: "Add more books to the library." },
  ]);

  // 9. Notices
  await Notice.insertMany([
    {
      title: "Exam Schedule Released",
      content: "The exam schedule for semester 4 is now available.",
      type: "exam",
      attachments: [
        { name: "Exam Schedule PDF", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" },
      ],
    },
    {
      title: "Annual Sports Meet",
      content: "Join us for the annual sports meet next month!",
      type: "event",
    },
  ]);

  console.log("✅ Sample data seeded successfully!");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
}); 