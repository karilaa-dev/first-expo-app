import { Image, StyleSheet, Platform, View, TextInput, Button, FlatList, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { Link, router } from 'expo-router'; // Import Link

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useTasks } from '@/context/TaskContext'; // Import useTasks hook

export default function HomeScreen() {
  const { tasks } = useTasks(); // Only need tasks here now

  const navigateToDetail = (task: string) => {
    router.push({ pathname: '/detail', params: { task } });
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Task List</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        {/* Add a button/link to navigate to the add task screen */}
        <Link href="/add-task" asChild>
          <Button title="Add New Task" />
        </Link>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
         <ThemedText type="subtitle">Tasks:</ThemedText>
         <FlatList
           data={tasks} // Use tasks from context
           keyExtractor={(item, index) => index.toString()}
           renderItem={({ item }) => (
             <TouchableOpacity onPress={() => navigateToDetail(item)}>
               <ThemedText style={styles.taskItem}>{item}</ThemedText>
             </TouchableOpacity>
           )}
         />
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
  taskItem: {
    paddingVertical: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    fontSize: 16,
  }
});
