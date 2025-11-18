import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Card, Title, List, Avatar, Button, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/contexts/AuthContext';
import apiClient from '../../src/config/api';

export default function Profile() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      if (user?.role === 'STUDENT') {
        const response = await apiClient.get('/students/profile');
        setProfileData(response.data.student);
      } else {
        const response = await apiClient.get('/auth/profile');
        setProfileData(response.data.user);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProfile();
    setRefreshing(false);
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/auth/login');
  };

  const getInitials = () => {
    if (user?.student) {
      return `${user.student.firstName[0]}${user.student.lastName[0]}`;
    }
    if (user?.faculty) {
      return `${user.faculty.firstName[0]}${user.faculty.lastName[0]}`;
    }
    return user?.email[0].toUpperCase() || 'U';
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Card style={styles.profileCard}>
        <Card.Content style={styles.profileContent}>
          <Avatar.Text
            size={80}
            label={getInitials()}
            style={styles.avatar}
          />
          <Title style={styles.name}>
            {user?.student
              ? `${user.student.firstName} ${user.student.lastName}`
              : user?.faculty
              ? `${user.faculty.firstName} ${user.faculty.lastName}`
              : user?.email}
          </Title>
        </Card.Content>
      </Card>

      {user?.role === 'STUDENT' && profileData && (
        <Card style={styles.card}>
          <Card.Content>
            <Title>Student Information</Title>
            <List.Item
              title="Roll Number"
              description={profileData.rollNumber}
              left={(props) => <List.Icon {...props} icon="identifier" />}
            />
            <Divider />
            <List.Item
              title="Email"
              description={user.email}
              left={(props) => <List.Icon {...props} icon="email" />}
            />
            <Divider />
            <List.Item
              title="Department"
              description={profileData.department}
              left={(props) => <List.Icon {...props} icon="office-building" />}
            />
            <Divider />
            <List.Item
              title="Program"
              description={profileData.program}
              left={(props) => <List.Icon {...props} icon="school" />}
            />
            <Divider />
            <List.Item
              title="Academic Year"
              description={`Year ${profileData.academicYear}, Semester ${profileData.semester}`}
              left={(props) => <List.Icon {...props} icon="calendar" />}
            />
            <Divider />
            <List.Item
              title="Phone Number"
              description={profileData.phoneNumber || 'Not provided'}
              left={(props) => <List.Icon {...props} icon="phone" />}
            />
          </Card.Content>
        </Card>
      )}

      {user?.role === 'FACULTY' && profileData?.faculty && (
        <Card style={styles.card}>
          <Card.Content>
            <Title>Faculty Information</Title>
            <List.Item
              title="Employee ID"
              description={profileData.faculty.employeeId}
              left={(props) => <List.Icon {...props} icon="identifier" />}
            />
            <Divider />
            <List.Item
              title="Email"
              description={user.email}
              left={(props) => <List.Icon {...props} icon="email" />}
            />
            <Divider />
            <List.Item
              title="Department"
              description={profileData.faculty.department}
              left={(props) => <List.Icon {...props} icon="office-building" />}
            />
            <Divider />
            <List.Item
              title="Designation"
              description={profileData.faculty.designation}
              left={(props) => <List.Icon {...props} icon="account-tie" />}
            />
            <Divider />
            <List.Item
              title="Phone Number"
              description={profileData.faculty.phoneNumber || 'Not provided'}
              left={(props) => <List.Icon {...props} icon="phone" />}
            />
          </Card.Content>
        </Card>
      )}

      <Card style={styles.card}>
        <Card.Content>
          <Title>Quick Links</Title>
          <List.Item
            title="Attendance"
            left={(props) => <List.Icon {...props} icon="check-circle" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {}}
          />
          <Divider />
          <List.Item
            title="Grades"
            left={(props) => <List.Icon {...props} icon="chart-box" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {}}
          />
          <Divider />
          {user?.role === 'STUDENT' && (
            <>
              <List.Item
                title="Fees & Payments"
                left={(props) => <List.Icon {...props} icon="currency-inr" />}
                right={(props) => <List.Icon {...props} icon="chevron-right" />}
                onPress={() => {}}
              />
              <Divider />
            </>
          )}
          <List.Item
            title="Notifications"
            left={(props) => <List.Icon {...props} icon="bell" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {}}
          />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Settings</Title>
          <List.Item
            title="Change Password"
            left={(props) => <List.Icon {...props} icon="lock" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {}}
          />
          <Divider />
          <List.Item
            title="Notifications Settings"
            left={(props) => <List.Icon {...props} icon="bell-cog" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {}}
          />
          <Divider />
          <List.Item
            title="About"
            left={(props) => <List.Icon {...props} icon="information" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {}}
          />
        </Card.Content>
      </Card>

      <Button
        mode="outlined"
        icon="logout"
        onPress={handleLogout}
        style={styles.logoutButton}
      >
        Logout
      </Button>

      <View style={styles.footer}>
        <MaterialCommunityIcons name="information" size={16} color="#999" />
        <Title style={styles.footerText}>RGIPT Student Hub v1.0.0</Title>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  profileCard: {
    margin: 15,
    elevation: 4,
  },
  profileContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  avatar: {
    backgroundColor: '#1976d2',
    marginBottom: 15,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  card: {
    margin: 15,
    marginTop: 0,
  },
  logoutButton: {
    margin: 15,
    marginTop: 5,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 8,
  },
  footerText: {
    fontSize: 12,
    color: '#999',
  },
});
