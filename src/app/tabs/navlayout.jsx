import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import HabitsPresenter from '../../presenters/habitsPresenter';
import RegisterPresenter from '../../presenters/registerPresenter';
import LoginPresenter from '../../presenters/loginPresenter';

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
