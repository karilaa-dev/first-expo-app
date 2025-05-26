import { StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function DetailScreen() {
  const { task } = useLocalSearchParams();

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Task Details</ThemedText>
      <ThemedText style={styles.taskText}>
        {task ? task : 'No task details found.'}
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  taskText: {
    marginTop: 20,
    fontSize: 18,
  },
});
