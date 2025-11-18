import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Card, Title, Paragraph, Button, Chip, Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../src/contexts/AuthContext';
import apiClient from '../../src/config/api';
import { syncAllData } from '../../src/database/syncService';

export default function Home() {
  const { user, logout } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    enrolledCourses: 0,
    totalAttendance: 0,
    pendingFees: 0,
    unreadNotifications: 0,
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load dashboard statistics
      if (user?.role === 'STUDENT') {
        const [coursesRes, attendanceRes, feesRes, notificationsRes] = await Promise.all([
          apiClient.get('/students/courses'),
          apiClient.get('/students/attendance'),
          apiClient.get('/fees'),
          apiClient.get('/notifications'),
        ]);

        setStats({
          enrolledCourses: coursesRes.data.enrollments?.length || 0,
          totalAttendance: Math.round(
            (attendanceRes.data.summary?.reduce((acc: number, s: any) => 
              acc + (s.present / s.total) * 100, 0) / 
              (attendanceRes.data.summary?.length || 1)) || 0
          ),
          pendingFees: feesRes.data.feeRecords?.reduce((acc: number, fee: any) => {
            const paid = fee.payments?.reduce((p: number, payment: any) => 
              p + (payment.status === 'COMPLETED' ? payment.amount : 0), 0) || 0;
            return acc + (fee.totalAmount - paid);
          }, 0) || 0,
          unreadNotifications: notificationsRes.data.notifications?.filter(
            (n: any) => !n.isRead
          ).length || 0,
        });

        // Sync data to local database for offline access
        await syncAllData();
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Title style={styles.welcomeText}>
          Welcome, {user?.student?.firstName || user?.faculty?.firstName || user?.email}!
        </Title>
        <Chip icon="account" style={styles.roleChip}>
          {user?.role}
        </Chip>
      </View>

      {user?.role === 'STUDENT' && (
        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <MaterialCommunityIcons name="book-open-variant" size={32} color="#1976d2" />
              <View>
                <Text style={styles.statValue}>{stats.enrolledCourses}</Text>
                <Text style={styles.statLabel}>Enrolled Courses</Text>
              </View>
            </Card.Content>
          </Card>

          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <MaterialCommunityIcons name="check-circle" size={32} color="#4caf50" />
              <View>
                <Text style={styles.statValue}>{stats.totalAttendance}%</Text>
                <Text style={styles.statLabel}>Attendance</Text>
              </View>
            </Card.Content>
          </Card>

          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <MaterialCommunityIcons name="currency-inr" size={32} color="#ff9800" />
              <View>
                <Text style={styles.statValue}>₹{stats.pendingFees}</Text>
                <Text style={styles.statLabel}>Pending Fees</Text>
              </View>
            </Card.Content>
          </Card>

          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <MaterialCommunityIcons name="bell" size={32} color="#f44336" />
              <View>
                <Text style={styles.statValue}>{stats.unreadNotifications}</Text>
                <Text style={styles.statLabel}>Notifications</Text>
              </View>
            </Card.Content>
          </Card>
        </View>
      )}

      <Card style={styles.card}>
        <Card.Content>
          <Title>Quick Actions</Title>
          <View style={styles.quickActions}>
            <Button
              mode="contained"
              icon="calendar"
              style={styles.actionButton}
              onPress={() => {}}
            >
              View Schedule
            </Button>
            <Button
              mode="contained"
              icon="file-document"
              style={styles.actionButton}
              onPress={() => {}}
            >
              My Grades
            </Button>
            {user?.role === 'STUDENT' && (
              <Button
                mode="contained"
                icon="credit-card"
                style={styles.actionButton}
                onPress={() => {}}
              >
                Pay Fees
              </Button>
            )}
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Account</Title>
          <Paragraph>Email: {user?.email}</Paragraph>
          {user?.student && (
            <>
              <Paragraph>Roll No: {user.student.rollNumber}</Paragraph>
              <Paragraph>Department: {user.student.department}</Paragraph>
              <Paragraph>Year: {user.student.academicYear}, Semester: {user.student.semester}</Paragraph>
            </>
          )}
          {user?.faculty && (
            <>
              <Paragraph>Employee ID: {user.faculty.employeeId}</Paragraph>
              <Paragraph>Department: {user.faculty.department}</Paragraph>
              <Paragraph>Designation: {user.faculty.designation}</Paragraph>
            </>
          )}
          <Button
            mode="outlined"
            icon="logout"
            onPress={handleLogout}
            style={styles.logoutButton}
          >
            Logout
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#1976d2',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeText: {
    color: '#fff',
    fontSize: 20,
    flex: 1,
  },
  roleChip: {
    backgroundColor: '#fff',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    marginBottom: 15,
  },
  statContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  card: {
    margin: 15,
    marginTop: 0,
  },
  quickActions: {
    marginTop: 15,
    gap: 10,
  },
  actionButton: {
    marginBottom: 8,
  },
  logoutButton: {
    marginTop: 15,
  },
});
