import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export default function AddTaskScreen() {
  const [taskName, setTaskName] = useState('');
  const [submitError, setSubmitError] = useState('');
  const colorScheme = useColorScheme() ?? 'light';
  const queryClient = useQueryClient();

  const handleAddTask = async () => {
    if (taskName.trim() === '') {
      setSubmitError('Task name cannot be empty.');
      Alert.alert('Validation Error', 'Task name cannot be empty.');
      return;
    }

    setSubmitError('');

    const { error: insertError } = await supabase
      .from('tasks')
      .insert([{ name: taskName.trim() }]);

    if (insertError) {
      setSubmitError(insertError.message);
      Alert.alert('Error adding task', insertError.message);
    } else {
      setTaskName('');
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      Alert.alert('Success', 'Task added successfully!');
      router.back();
    }
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
      {submitError ? <ThemedText style={styles.errorText}>{submitError}</ThemedText> : null}
      <Button title="Save Task" onPress={handleAddTask} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
  },
  input: {
    height: 40,
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: 'transparent',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});
