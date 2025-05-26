import {
  Image,
  StyleSheet,
  View,
  ActivityIndicator,
  Button,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useState, useMemo } from 'react';
import { Link, router } from 'expo-router';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useSupabaseTasks, Task } from '@/hooks/useSupabaseTasks';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function HomeScreen() {
  const { data: tasks, isLoading, error, refetch } = useSupabaseTasks();
  const colorScheme = useColorScheme() ?? 'light';
  const [searchQuery, setSearchQuery] = useState('');

  const navigateToDetail = (task: Task) => {
    router.push({
      pathname: '/detail',
      params: { taskId: task.id, taskName: task.name },
    });
  };

  const [isRefreshing, setIsRefreshing] = useState(false);
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  // Filter tasks based on search query
  const filteredTasks = useMemo(() => {
    if (!tasks) return [];
    if (!searchQuery.trim()) return tasks;
    return tasks.filter(task =>
      task.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [tasks, searchQuery]);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Task List (Supabase)</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <Link href="/add-task" asChild>
          <Button title="Add New Task" />
        </Link>
      </ThemedView>

      {/* Search Input */}
      <ThemedView style={styles.stepContainer}>
        <TextInput
          style={[
            styles.searchInput,
            {
              borderColor: Colors[colorScheme].icon,
              color: Colors[colorScheme].text,
              backgroundColor: Colors[colorScheme].background,
            },
          ]}
          placeholder="Search tasks..."
          placeholderTextColor={Colors[colorScheme].icon}
          value={searchQuery}
          onChangeText={setSearchQuery}
          testID="search-input"
        />
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Tasks:</ThemedText>
        {isLoading && !isRefreshing && (
          <ActivityIndicator
            size="large"
            color={Colors[colorScheme].text}
            testID="activity-indicator"
          />
        )}
        {error && (
          <ThemedText style={styles.errorText}>
            Error fetching tasks: {error.message}
          </ThemedText>
        )}
        {!isLoading && !error && (
          <FlatList
            data={filteredTasks}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => navigateToDetail(item)}
                style={[
                  styles.taskItemContainer,
                  { borderBottomColor: Colors[colorScheme].icon },
                ]}
                testID={`task-item-${item.id}`}
              >
                <View>
                  <ThemedText style={styles.taskName}>{item.name}</ThemedText>
                  <ThemedText
                    style={[
                      styles.taskDate,
                      { color: Colors[colorScheme].tint },
                    ]}
                  >
                    Created: {new Date(item.created_at).toLocaleString()}
                  </ThemedText>
                </View>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <ThemedText testID="empty-list">
                {searchQuery.trim()
                  ? 'No tasks match your search.'
                  : 'No tasks found. Pull down to refresh.'}
              </ThemedText>
            }
            onRefresh={handleRefresh}
            refreshing={isRefreshing}
            testID="task-list"
          />
        )}
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
  },
  taskItemContainer: {
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  taskName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  taskDate: {
    fontSize: 12,
    marginTop: 4,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});
