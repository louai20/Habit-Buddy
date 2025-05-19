# HABIT-BUDDY APP

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/Habit-Buddy.git
cd Habit-Buddy
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables::
   - Create a .env file in the root directory and ask us for the variables.

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```


# Description

A habit tracking application built with React Native that helps users create, maintain, and track their habits.

## Features Implemented

- User Authentication
  - Sign up and login functionality

- Habit Management
  - Create new habits with detailed information
  - Edit existing habits
  - Delete unwanted habits
  - Progress overview for last 7 days
  - Track each habit in a calendar

- API
  - Motivational quotes
  - Weather data and forecast 
  - Avatar selection

## Third-party Components

- DropDownPicker from "react-native-dropdown-picker";
- DateTimePicker from '@react-native-community/datetimepicker';

## Project Structure

- _layout.jsx
Initializes the root layout of the app. It wraps the entire application in a Redux provider, renders the AuthPresenter for authentication checks, and loads the main tab-based navigation layout (TabsLayout). Also wrapped in StrictMode to catch potential issues during development.

- addHabit.jsx
Screen for adding new habits. It renders the AddHabitsPresenter, which contains the UI and logic for creating a new habit.

- dashboard.jsx
Main landing page (Dashboard) of the app. It loads the DashboardPresenter, which is responsible for displaying habit stats, weather, and a motivational quote.

- editHabit.jsx
This page allows users to edit existing habits. It renders the EditHabitPresenter, which contains the interface and logic for modifying habit details.

- login.jsx
Screen for user login. It displays the LoginPresenter, which manages the authentication UI and login logic.

- register.jsx
Screen for user registration. It shows the RegisterPresenter, responsible for the sign-up interface and user creation logic.

- navlayout.jsx
Defines the bottom tab navigation for the app using React Navigation. It registers all major routes (Dashboard, Add Habit, Edit Habit, Progress, etc.) and hides secondary ones like login, register, and motivation using tabBarButton: () => null.

- authSlice.jsx
Manages authentication state for the app.
Handles login, registration, and logout using Firebase Authentication. Stores the current user, loading states, and error messages. Uses AsyncStorage to persist user sessions.

- habitsSlice.jsx
Manages all state and actions related to user habits. This include fetching habits from Firebase, adding, updating, and deleting habits and marking habits as completed or unmarking them All habits are stored under a single user document in Firestore and updated using async thunks with Redux Toolkit.

- quotesSlice.jsx
Handles the fetching and storage of daily motivational quotes.
Uses the ZenQuotes API via a cache-busting proxy, and falls back to a set of predefined quotes if the API fails or is rate-limited.
Stored quote includes the text and author, and supports a clearQuote reducer for manual reset.

- weatherSlice.jsx
Manages weather data fetched from the Open-Meteo API. It stores the current weather conditions and 7-day daily forecast. Uses Redux async thunk (fetchWeather) to fetch based on user’s coordinates. Supports state loading and error handling for smoother UI behavior.

- addHabitPresenter.jsx
Connects the AddHabitView to the Redux store.
Passes the authenticated user and a setHabit dispatcher to the view, allowing users to create and save new habits to Firebase.

- authPresenter.jsx
Initializes user authentication state on app launch.
Checks if a user is already logged in (via AsyncStorage), fetches their data from Firestore, and updates the Redux store. Also handles logout.

- dashboardPresenter.jsx
Fetches the authenticated user’s habits from Firebase when the dashboard loads.
Passes the retrieved data (or loading/error states) to the DashboardView. Redirects to login if no user is found.

- editHabitPresenter.jsx
Connects the EditHabitView to Redux.
Allows the user to update or delete a habit by dispatching the appropriate Redux actions (updateHabit, deleteHabit), and passes habit/user info to the view.

- loginPresenter.jsx
Manages user login functionality.
Handles form input, submits login credentials, and redirects to the dashboard on success. It passes props to the LoginView, including loading and error states.

- progressPresenter.jsx
Acts as a simple passthrough to render the ProgressView.
Can be expanded later to manage Redux logic or computed progress data if needed.

- registerPresenter.jsx
Handles user registration logic.
Manages form state for name, email, and password, then dispatches the registerWithEmail action to create a new user in Firebase. Passes props to the RegisterView.

- store.jsx
Central configuration for Redux store.
Combines reducers (habits, auth, weather, quotes) and registers listener middleware to re-fetch habits when a habit is created, updated, or marked as done/undone.

- addHabitView.jsx
UI form for users to add new habits.
Includes fields for name, description, frequency, and start/end dates. Also handles input validation, success/failure alerts, and resets the form after submission.

- editHabitView.jsx
UI for editing or deleting habits.
Allows users to select an existing habit, update its data, or remove it. Includes dynamic form fields and handles form state based on the selected habit.

- authView.jsx
Manages the authentication section UI.
Displays login/register options if no user is logged in and logout button + welcome message if a user is authenticated.

- loginView.jsx
Simple login form with email and password input.
Handles form input, displays error or loading states and triggers the login function passed via props.

- registerView.jsx
Form to create a new account.
Includes name, email, and password input fields, loading indicator, error messages, and submit handler.

- dashboardView.jsx
Main home screen UI for the app.
Displays a motivational quote, current weather, 7-day forecast, user’s habits, a calendar of completed habits and summary cards like “Habits Completed Today.” Also includes a shortcut to the Progress screen.

- progressView.jsx
Displays the user’s habit progress over time.
Includes total habits, daily completions, and a weekly bar chart visualizing completions using react-native-chart-kit.

- habitTrackerView.jsx
Provides a detailed calendar interface for tracking individual habits.
Features include a calendar with color-coded dates (green for completed, orange for missed), progress tracking with completion percentage, longest streak calculation, and date range validation. Supports both marking and unmarking habits as complete for specific dates.

- habitPresenter.jsx
Connects the HabitTrackerView to the Redux store.
Manages the connection between the view and Redux state, handles user authentication checks, and provides habit data and action dispatchers (updateHabit, deleteHabit) to the view. Includes unauthorized view redirection for unauthenticated users.