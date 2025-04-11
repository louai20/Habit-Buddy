import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import HabitsPresenter from '../../presenters/habitsPresenter';
import RegisterPresenter from '../../presenters/registerPresenter';
import LoginPresenter from '../../presenters/loginPresenter';
import MotivationPage from '../../components/MotivationPage';
import AddHabitPresenter from '../../presenters/addHabitPresenter';
import EditHabitPresenter from '../../presenters/editHabitPresenter';

const Tab = createBottomTabNavigator();

export default function TabsLayout() {
  return (
      <Tab.Navigator
        screenOptions={{
          headerShown: true,
          style: { justifyContent: 'space-around' }
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
          name="register"
          component={RegisterPresenter}
          options={{
            tabBarButton: () => null, // Hides the tab
            headerShown: false,
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
          name="login"
          component={LoginPresenter}
          options={{
            tabBarButton: () => null, // Hides the tab
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="editHabit"
          component={EditHabitPresenter}
          options={{
            title: 'Edit Habit',
            tabBarIcon: () => <Text>✏️</Text>,
          }}
        />
      </Tab.Navigator>
  );
}
