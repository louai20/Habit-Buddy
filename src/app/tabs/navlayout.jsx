import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import DashboardPresenter from  '../../presenters/dashboardPresenter'
import RegisterPresenter from '../../presenters/registerPresenter';
import LoginPresenter from '../../presenters/loginPresenter';
import MotivationPage from '../../components/MotivationPage';
import AddHabitPresenter from '../../presenters/addHabitPresenter';
import EditHabitPresenter from '../../presenters/editHabitPresenter';
import ProgressPresenter from "../../presenters/progressPresenter";

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
          name="dashboard"
          component={DashboardPresenter}
          options={{
            title: 'Dashboard',
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
        <Tab.Screen
          name="motivation"
          component={MotivationPage}
          options={{
            tabBarButton: () => null, // Hides the tab
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="progress"
          component={ProgressPresenter}
          options={{
            title: 'Progress',
            tabBarIcon: () => <Text>📊</Text>,
          }}
        />
      </Tab.Navigator>
  );
}
