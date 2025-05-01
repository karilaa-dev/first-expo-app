import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { useTasks } from '@/context/TaskContext';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

export default function AddTaskScreen() {
  const [taskName, setTaskName] = useState('');
  const [error, setError] = useState('');
  const { addTask } = useTasks();
  const colorScheme = useColorScheme() ?? 'light';

  const handleAddTask = () => {
    if (taskName.trim() === '') {
      setError('Task name cannot be empty.');
      Alert.alert('Validation Error', 'Task name cannot be empty.'); // Also show an alert
      return;
    }

    setError(''); // Clear error if validation passes
    addTask(taskName.trim());
    setTaskName(''); // Clear input field
    router.back(); // Navigate back to the previous screen (home)
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Add New Task</ThemedText>
      <TextInput
        style={[styles.input, { color: Colors[colorScheme].text, borderColor: Colors[colorScheme].icon }]}
        placeholder="Enter task name or description"
        value={taskName}
        onChangeText={setTaskName}
        placeholderTextColor={Colors[colorScheme].icon}
      />
      {error ? <ThemedText style={styles.errorText}>{error}</ThemedText> : null}
      <Button title="Save Task" onPress={handleAddTask} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50, // Add padding to avoid overlap with header
  },
  input: {
    height: 40,
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: 'transparent', // Use theme background
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});
