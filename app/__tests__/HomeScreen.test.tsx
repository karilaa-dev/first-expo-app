import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import HomeScreen from '../(tabs)/index';

// Mock the hooks and dependencies
jest.mock('@/hooks/useSupabaseTasks', () => ({
  useSupabaseTasks: jest.fn(),
}));

jest.mock('@/hooks/useColorScheme', () => ({
  useColorScheme: jest.fn(() => 'light'),
}));

jest.mock('expo-router', () => ({
  Link: ({ children }: any) => children,
  router: {
    push: jest.fn(),
  },
}));

// Mock navigation dependencies
jest.mock('@react-navigation/bottom-tabs', () => ({
  useBottomTabBarHeight: jest.fn(() => 80),
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: jest.fn(() => ({ bottom: 0, top: 0, left: 0, right: 0 })),
}));

// Mock ParallaxScrollView to render children directly
jest.mock('@/components/ParallaxScrollView', () => {
  return function MockParallaxScrollView({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return <>{children}</>;
  };
});

// Mock other components
jest.mock('@/components/HelloWave', () => ({
  HelloWave: () => null,
}));

// Mock image require
jest.mock('@/assets/images/partial-react-logo.png', () => 'mocked-image');

import { useSupabaseTasks } from '@/hooks/useSupabaseTasks';

const mockUseSupabaseTasks = useSupabaseTasks as jest.MockedFunction<
  typeof useSupabaseTasks
>;

// Create a wrapper with QueryClient for React Query
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

const mockTasks = [
  {
    id: 1,
    name: 'Complete project documentation',
    created_at: '2024-01-15T10:30:00Z',
  },
  {
    id: 2,
    name: 'Review pull requests',
    created_at: '2024-01-16T14:20:00Z',
  },
  {
    id: 3,
    name: 'Update unit tests',
    created_at: '2024-01-17T09:15:00Z',
  },
];

// Helper function to create properly typed mock return values
const createMockQueryResult = (overrides: any = {}) => ({
  data: undefined,
  error: null,
  isError: false,
  isLoading: false,
  isLoadingError: false,
  isRefetchError: false,
  isStale: false,
  isSuccess: false,
  isPending: false,
  status: 'success' as const,
  fetchStatus: 'idle' as const,
  refetch: jest.fn(),
  ...overrides,
});

describe('HomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('1.a. The Home screen renders a list of items', () => {
    it('should render a list of tasks when data is loaded', async () => {
      mockUseSupabaseTasks.mockReturnValue(
        createMockQueryResult({
          data: mockTasks,
          isLoading: false,
          isSuccess: true,
          error: null,
        })
      );

      render(<HomeScreen />, { wrapper: createWrapper() });

      // Check if the task list is rendered
      expect(screen.getByTestId('task-list')).toBeTruthy();

      // Check if all tasks are rendered
      await waitFor(() => {
        expect(screen.getByText('Complete project documentation')).toBeTruthy();
        expect(screen.getByText('Review pull requests')).toBeTruthy();
        expect(screen.getByText('Update unit tests')).toBeTruthy();
      });

      // Check if task items have the correct testIDs
      expect(screen.getByTestId('task-item-1')).toBeTruthy();
      expect(screen.getByTestId('task-item-2')).toBeTruthy();
      expect(screen.getByTestId('task-item-3')).toBeTruthy();
    });

    it('should show loading indicator when data is loading', () => {
      mockUseSupabaseTasks.mockReturnValue(
        createMockQueryResult({
          data: undefined,
          isLoading: true,
          isPending: true,
          status: 'pending',
          error: null,
        })
      );

      render(<HomeScreen />, { wrapper: createWrapper() });

      expect(screen.getByTestId('activity-indicator')).toBeTruthy();
    });

    it('should show error message when there is an error', () => {
      const errorMessage = 'Failed to fetch tasks';
      mockUseSupabaseTasks.mockReturnValue(
        createMockQueryResult({
          data: undefined,
          isLoading: false,
          isError: true,
          status: 'error',
          error: new Error(errorMessage),
        })
      );

      render(<HomeScreen />, { wrapper: createWrapper() });

      expect(
        screen.getByText(`Error fetching tasks: ${errorMessage}`)
      ).toBeTruthy();
    });

    it('should show empty state when no tasks are available', () => {
      mockUseSupabaseTasks.mockReturnValue(
        createMockQueryResult({
          data: [],
          isLoading: false,
          isSuccess: true,
          error: null,
        })
      );

      render(<HomeScreen />, { wrapper: createWrapper() });

      expect(screen.getByTestId('empty-list')).toBeTruthy();
      expect(
        screen.getByText('No tasks found. Pull down to refresh.')
      ).toBeTruthy();
    });
  });

  describe('1.b. The list is filtered when a user types into the search input', () => {
    beforeEach(() => {
      mockUseSupabaseTasks.mockReturnValue(
        createMockQueryResult({
          data: mockTasks,
          isLoading: false,
          isSuccess: true,
          error: null,
        })
      );
    });

    it('should render search input with correct placeholder', () => {
      render(<HomeScreen />, { wrapper: createWrapper() });

      const searchInput = screen.getByTestId('search-input');
      expect(searchInput).toBeTruthy();
      expect(searchInput.props.placeholder).toBe('Search tasks...');
    });

    it('should filter tasks based on search query', async () => {
      render(<HomeScreen />, { wrapper: createWrapper() });

      const searchInput = screen.getByTestId('search-input');

      // Initially all tasks should be visible
      expect(screen.getByText('Complete project documentation')).toBeTruthy();
      expect(screen.getByText('Review pull requests')).toBeTruthy();
      expect(screen.getByText('Update unit tests')).toBeTruthy();

      // Search for "project"
      fireEvent.changeText(searchInput, 'project');

      await waitFor(() => {
        // Only the task containing "project" should be visible
        expect(screen.getByText('Complete project documentation')).toBeTruthy();
        expect(screen.queryByText('Review pull requests')).toBeNull();
        expect(screen.queryByText('Update unit tests')).toBeNull();
      });
    });

    it('should be case insensitive when filtering', async () => {
      render(<HomeScreen />, { wrapper: createWrapper() });

      const searchInput = screen.getByTestId('search-input');

      // Search with uppercase
      fireEvent.changeText(searchInput, 'REVIEW');

      await waitFor(() => {
        expect(screen.queryByText('Complete project documentation')).toBeNull();
        expect(screen.getByText('Review pull requests')).toBeTruthy();
        expect(screen.queryByText('Update unit tests')).toBeNull();
      });
    });

    it('should show empty state message when search yields no results', async () => {
      render(<HomeScreen />, { wrapper: createWrapper() });

      const searchInput = screen.getByTestId('search-input');

      // Search for something that doesn't exist
      fireEvent.changeText(searchInput, 'nonexistent task');

      await waitFor(() => {
        expect(screen.getByTestId('empty-list')).toBeTruthy();
        expect(screen.getByText('No tasks match your search.')).toBeTruthy();
      });
    });

    it('should show all tasks when search input is cleared', async () => {
      render(<HomeScreen />, { wrapper: createWrapper() });

      const searchInput = screen.getByTestId('search-input');

      // First filter
      fireEvent.changeText(searchInput, 'project');

      await waitFor(() => {
        expect(screen.getByText('Complete project documentation')).toBeTruthy();
        expect(screen.queryByText('Review pull requests')).toBeNull();
      });

      // Clear search
      fireEvent.changeText(searchInput, '');

      await waitFor(() => {
        // All tasks should be visible again
        expect(screen.getByText('Complete project documentation')).toBeTruthy();
        expect(screen.getByText('Review pull requests')).toBeTruthy();
        expect(screen.getByText('Update unit tests')).toBeTruthy();
      });
    });

    it('should ignore whitespace in search query', async () => {
      render(<HomeScreen />, { wrapper: createWrapper() });

      const searchInput = screen.getByTestId('search-input');

      // Search with whitespace
      fireEvent.changeText(searchInput, '   ');

      await waitFor(() => {
        // All tasks should still be visible
        expect(screen.getByText('Complete project documentation')).toBeTruthy();
        expect(screen.getByText('Review pull requests')).toBeTruthy();
        expect(screen.getByText('Update unit tests')).toBeTruthy();
      });
    });
  });
});
