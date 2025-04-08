import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import HabitsPresenter from '../../presenters/habitsPresenter';
import RegisterPresenter from '../../presenters/registerPresenter';
import LoginPresenter from '../../presenters/loginPresenter';
import MotivationPage from '../../components/MotivationPage';
import AddHabitPresenter from '../../presenters/addHabitPresenter';

const Tab = createBottomTabNavigator();

export default function TabsLayout() {
  return (
      <Tab.Navigator
        screenOptions={{
          headerShown: true,
        }}
      >
        <Tab.Screen
          name="habits"
          component={HabitsPresenter}
          options={{
            title: 'Habits',
            tabBarIcon: () => <Text>📊</Text>,
          }}
        />
        <Tab.Screen
          name="addHabit"
          component={AddHabitPresenter}
          options={{
            title: 'Add Habit',
            tabBarIcon: () => <Text>📝</Text>,
          }}
        />
        <Tab.Screen
          name="motivation"
          component={MotivationPage}
          options={{
            title: 'Motivation',
            tabBarIcon: () => <Text>💬</Text>,
          }}
        />
        <Tab.Screen
          name="register"
          component={RegisterPresenter}
          options={{
            title: 'Register',
            tabBarIcon: () => <Text>📝</Text>,
          }}
        />
        <Tab.Screen
          name="login"
          component={LoginPresenter}
          options={{
            title: 'Login',
            tabBarIcon: () => <Text>📝</Text>,
          }}
        />
      </Tab.Navigator>
  );
}
