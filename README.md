# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Application Configuration

### Supabase Integration

This project uses Supabase for its backend database.

**1. Client Setup (`lib/supabase.ts`):**
   - Initialize the Supabase client in `lib/supabase.ts`.
   - **Action Required:** You must add your Supabase project URL and public anon key to this file.

   ```typescript
   // lib/supabase.ts (Example)
   import { createClient } from '@supabase/supabase-js';
   export const supabase = createClient('YOUR_SUPABASE_URL', 'YOUR_SUPABASE_ANON_KEY');
   ```

**2. Table Setup (`tasks`):**
   - A Supabase table named `tasks` is used.
   - Required columns: `id` (int8, PK), `name` (text), `created_at` (timestamp, default now()).

### React-Query for Data Fetching

`@tanstack/react-query` is used for fetching and managing data from Supabase.

**1. Provider Setup (`app/_layout.tsx`):**
   - The main app layout (`app/_layout.tsx`) wraps the application with `QueryClientProvider`.

**2. Fetching Data (`hooks/useSupabaseTasks.ts`):
   - The custom hook `hooks/useSupabaseTasks.ts` defines the logic for fetching the `tasks` table data using `useQuery`.

**3. Usage in Components:**
   - Screens like `app/(tabs)/index.tsx` (HomeScreen) use `useSupabaseTasks` to display tasks and handle loading/error states.
   - New tasks added via `app/add-task.tsx` trigger a data refetch by invalidating the `['tasks']` query key, ensuring the list stays up-to-date.

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
