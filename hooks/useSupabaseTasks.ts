import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase'; // Adjust path as needed

// Define the expected shape of a task item
export interface Task {
  id: number;
  name: string; // Assuming your tasks table has a 'name' column
  created_at: string;
  // Add other fields from your 'tasks' table here
  // e.g., description?: string;
  // e.g., is_completed?: boolean;
}

const fetchTasks = async () => {
  const { data, error } = await supabase
    .from('tasks') // Your table name
    .select('*'); // Select all columns, or specify like: 'id, name, created_at'

  if (error) {
    throw new Error(error.message);
  }
  return data as Task[];
};

export const useSupabaseTasks = () => {
  return useQuery<Task[], Error>({
    queryKey: ['tasks'], // Unique key for this query
    queryFn: fetchTasks,
  });
}; 