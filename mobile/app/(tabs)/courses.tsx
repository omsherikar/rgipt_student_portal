import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, Alert } from 'react-native';
import { Card, Title, Paragraph, Button, Chip, Text, FAB, Searchbar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../src/contexts/AuthContext';
import apiClient from '../../src/config/api';
import { getLocalCourses } from '../../src/database/syncService';

interface Course {
  id: string;
  code: string;
  name: string;
  description: string;
  credits: number;
  department: string;
  faculty?: {
    firstName: string;
    lastName: string;
    designation: string;
  };
  _count?: {
    enrollments: number;
  };
  maxEnrollment: number;
}

export default function Courses() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    loadCourses();
  }, [showAll]);

  const loadCourses = async () => {
    try {
      setLoading(true);

      if (user?.role === 'STUDENT') {
        // Load enrolled courses
        const enrolledRes = await apiClient.get('/students/courses');
        const enrolled = enrolledRes.data.enrollments.map((e: any) => e.courseId);
        setEnrolledCourses(enrolled);

        if (showAll) {
          // Load all available courses
          const coursesRes = await apiClient.get('/courses');
          setCourses(coursesRes.data.courses);
        } else {
          // Show only enrolled courses
          setCourses(enrolledRes.data.enrollments.map((e: any) => e.course));
        }
      } else {
        // For faculty/admin, show all courses
        const coursesRes = await apiClient.get('/courses');
        setCourses(coursesRes.data.courses);
      }
    } catch (error) {
      console.error('Error loading courses:', error);
      // Try loading from local cache
      const localCourses = await getLocalCourses();
      setCourses(localCourses);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCourses();
    setRefreshing(false);
  };

  const handleEnroll = async (courseId: string) => {
    try {
      await apiClient.post('/courses/enroll', { courseId });
      Alert.alert('Success', 'Enrolled successfully!');
      loadCourses();
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to enroll');
    }
  };

  const handleUnenroll = async (courseId: string) => {
    Alert.alert(
      'Confirm Unenroll',
      'Are you sure you want to unenroll from this course?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Unenroll',
          style: 'destructive',
          onPress: async () => {
            try {
              await apiClient.delete(`/courses/${courseId}/unenroll`);
              Alert.alert('Success', 'Unenrolled successfully!');
              loadCourses();
            } catch (error: any) {
              Alert.alert('Error', error.response?.data?.error || 'Failed to unenroll');
            }
          },
        },
      ]
    );
  };

  const filteredCourses = courses.filter(
    (course) =>
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderCourse = ({ item }: { item: Course }) => {
    const isEnrolled = enrolledCourses.includes(item.id);
    const enrollmentCount = item._count?.enrollments || 0;
    const isFull = enrollmentCount >= item.maxEnrollment;

    return (
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <Title>{item.code}</Title>
            <Chip icon="credit-card" size={20}>
              {item.credits} Credits
            </Chip>
          </View>
          <Title>{item.name}</Title>
          <Paragraph style={styles.description}>{item.description}</Paragraph>
          
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="office-building" size={16} color="#666" />
            <Text style={styles.infoText}>{item.department}</Text>
          </View>

          {item.faculty && (
            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="account-tie" size={16} color="#666" />
              <Text style={styles.infoText}>
                {item.faculty.firstName} {item.faculty.lastName} ({item.faculty.designation})
              </Text>
            </View>
          )}

          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="account-group" size={16} color="#666" />
            <Text style={styles.infoText}>
              {enrollmentCount}/{item.maxEnrollment} students
            </Text>
          </View>

          {user?.role === 'STUDENT' && (
            <View style={styles.actions}>
              {isEnrolled ? (
                <Button
                  mode="outlined"
                  onPress={() => handleUnenroll(item.id)}
                  icon="logout"
                >
                  Unenroll
                </Button>
              ) : (
                <Button
                  mode="contained"
                  onPress={() => handleEnroll(item.id)}
                  disabled={isFull}
                  icon="login"
                >
                  {isFull ? 'Full' : 'Enroll'}
                </Button>
              )}
            </View>
          )}
        </Card.Content>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search courses..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />

      <FlatList
        data={filteredCourses}
        renderItem={renderCourse}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="book-off" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No courses found</Text>
          </View>
        }
      />

      {user?.role === 'STUDENT' && (
        <FAB
          icon={showAll ? 'filter-off' : 'filter'}
          label={showAll ? 'My Courses' : 'All Courses'}
          onPress={() => setShowAll(!showAll)}
          style={styles.fab}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchbar: {
    margin: 10,
    elevation: 2,
  },
  list: {
    padding: 10,
    paddingTop: 0,
  },
  card: {
    marginBottom: 15,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  description: {
    marginTop: 5,
    marginBottom: 10,
    color: '#666',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  actions: {
    marginTop: 15,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#999',
  },
});
