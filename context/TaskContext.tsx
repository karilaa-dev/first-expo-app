import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define the shape of the context data
interface TaskContextData {
  tasks: string[];
  addTask: (task: string) => void;
}

// Create the context with a default value
const TaskContext = createContext<TaskContextData | undefined>(undefined);

// Create a provider component
interface TaskProviderProps {
  children: ReactNode;
}

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const [tasks, setTasks] = useState<string[]>(['Learn React Native', 'Build an app', 'Explore Expo']);

  const addTask = (task: string) => {
    if (task.trim()) {
      setTasks(prevTasks => [...prevTasks, task.trim()]);
    }
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask }}>
      {children}
    </TaskContext.Provider>
  );
};

// Create a custom hook to use the task context
export const useTasks = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
