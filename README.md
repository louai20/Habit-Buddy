# Habit-Buddy

A habit tracking application built with React Native that helps users create, maintain, and track their habits.

## Features Implemented

- User Authentication
  - Sign up and login functionality

- Habit Management
  - Create new habits with detailed information
  - Edit existing habits
  - Delete unwanted habits
  - Progress overview for last 7 days

- API
  - Motivational quotes
  - Weather data and forecast 

## Planned Features

- [ ] Progress Tracking
  - Progress visualization for each habit

- [ ] Social Features
  - Share habits with friends

- [ ] User Experience
  - UI improvements for a better user experience

## Project Structure

### Key Files

- `addHabitView.jsx`: Handles the creation of new habits with form validation and data submission
- `editHabitView.jsx`: Manages the editing and deletion of existing habits
- `App.js`: Main application router and state management
- `services/`: Contains API integration and data management logic

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

3. Set up Firebase:
   - Copy your Firebase configuration to `src/firebaseConfig.js`

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```
