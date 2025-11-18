import * as SQLite from 'expo-sqlite';
import apiClient from '../config/api';

// Open database
const db = SQLite.openDatabaseSync('rgipt_local.db');

// Initialize local database tables
export const initializeDatabase = async () => {
  try {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS courses (
        id TEXT PRIMARY KEY,
        code TEXT,
        name TEXT,
        description TEXT,
        credits INTEGER,
        data TEXT,
        synced INTEGER DEFAULT 0,
        lastUpdated TEXT
      );

      CREATE TABLE IF NOT EXISTS attendance (
        id TEXT PRIMARY KEY,
        studentId TEXT,
        courseId TEXT,
        date TEXT,
        status TEXT,
        data TEXT,
        synced INTEGER DEFAULT 0,
        lastUpdated TEXT
      );

      CREATE TABLE IF NOT EXISTS grades (
        id TEXT PRIMARY KEY,
        testId TEXT,
        studentId TEXT,
        marksObtained REAL,
        grade TEXT,
        data TEXT,
        synced INTEGER DEFAULT 0,
        lastUpdated TEXT
      );

      CREATE TABLE IF NOT EXISTS messages (
        id TEXT PRIMARY KEY,
        senderId TEXT,
        receiverId TEXT,
        content TEXT,
        type TEXT,
        data TEXT,
        synced INTEGER DEFAULT 0,
        createdAt TEXT
      );

      CREATE TABLE IF NOT EXISTS notifications (
        id TEXT PRIMARY KEY,
        title TEXT,
        message TEXT,
        type TEXT,
        isRead INTEGER DEFAULT 0,
        data TEXT,
        createdAt TEXT
      );
    `);
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
};

// Sync courses from server to local DB
export const syncCoursesFromServer = async () => {
  try {
    const response = await apiClient.get('/courses');
    const courses = response.data.courses;

    for (const course of courses) {
      await db.runAsync(
        `INSERT OR REPLACE INTO courses (id, code, name, description, credits, data, synced, lastUpdated) 
         VALUES (?, ?, ?, ?, ?, ?, 1, ?)`,
        [
          course.id,
          course.code,
          course.name,
          course.description || '',
          course.credits,
          JSON.stringify(course),
          new Date().toISOString(),
        ]
      );
    }
    console.log('Courses synced successfully');
  } catch (error) {
    console.error('Course sync error:', error);
  }
};

// Sync attendance from server to local DB
export const syncAttendanceFromServer = async () => {
  try {
    const response = await apiClient.get('/students/attendance');
    const attendances = response.data.attendances;

    for (const attendance of attendances) {
      await db.runAsync(
        `INSERT OR REPLACE INTO attendance (id, studentId, courseId, date, status, data, synced, lastUpdated) 
         VALUES (?, ?, ?, ?, ?, ?, 1, ?)`,
        [
          attendance.id,
          attendance.studentId,
          attendance.courseId,
          attendance.date,
          attendance.status,
          JSON.stringify(attendance),
          new Date().toISOString(),
        ]
      );
    }
    console.log('Attendance synced successfully');
  } catch (error) {
    console.error('Attendance sync error:', error);
  }
};

// Sync grades from server to local DB
export const syncGradesFromServer = async () => {
  try {
    const response = await apiClient.get('/tests/grades');
    const results = response.data.results;

    for (const result of results) {
      await db.runAsync(
        `INSERT OR REPLACE INTO grades (id, testId, studentId, marksObtained, grade, data, synced, lastUpdated) 
         VALUES (?, ?, ?, ?, ?, ?, 1, ?)`,
        [
          result.id,
          result.testId,
          result.studentId,
          result.marksObtained,
          result.grade || '',
          JSON.stringify(result),
          new Date().toISOString(),
        ]
      );
    }
    console.log('Grades synced successfully');
  } catch (error) {
    console.error('Grades sync error:', error);
  }
};

// Get local courses
export const getLocalCourses = async () => {
  try {
    const result = await db.getAllAsync('SELECT * FROM courses ORDER BY code');
    return result.map((row: any) => JSON.parse(row.data));
  } catch (error) {
    console.error('Get local courses error:', error);
    return [];
  }
};

// Get local attendance
export const getLocalAttendance = async () => {
  try {
    const result = await db.getAllAsync('SELECT * FROM attendance ORDER BY date DESC');
    return result.map((row: any) => JSON.parse(row.data));
  } catch (error) {
    console.error('Get local attendance error:', error);
    return [];
  }
};

// Get local grades
export const getLocalGrades = async () => {
  try {
    const result = await db.getAllAsync('SELECT * FROM grades');
    return result.map((row: any) => JSON.parse(row.data));
  } catch (error) {
    console.error('Get local grades error:', error);
    return [];
  }
};

// Sync all data from server
export const syncAllData = async () => {
  try {
    await syncCoursesFromServer();
    await syncAttendanceFromServer();
    await syncGradesFromServer();
    console.log('All data synced successfully');
  } catch (error) {
    console.error('Sync all data error:', error);
  }
};

// Clear local database
export const clearLocalDatabase = async () => {
  try {
    await db.execAsync(`
      DELETE FROM courses;
      DELETE FROM attendance;
      DELETE FROM grades;
      DELETE FROM messages;
      DELETE FROM notifications;
    `);
    console.log('Local database cleared');
  } catch (error) {
    console.error('Clear database error:', error);
  }
};
