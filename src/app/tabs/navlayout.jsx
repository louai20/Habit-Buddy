import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import DashboardPresenter from  '../../presenters/dashboardPresenter'
import RegisterPresenter from '../../presenters/registerPresenter';
import LoginPresenter from '../../presenters/loginPresenter';
import AddHabitPresenter from '../../presenters/addHabitPresenter';
import EditHabitPresenter from '../../presenters/editHabitPresenter';
import ProgressPresenter from "../../presenters/progressPresenter";
import HabitPresenter from "../../presenters/habitPresenter";
import HabitTrackerPresenter from "../../presenters/habitTrackerPresenter";
import AvatarPickerView from "../../views/avatarPickerView";

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
          name="avatarPicker"
          component={AvatarPickerView}
          options={{
            title: 'Pick Avatar',
            headerTitle: 'Choose Your Avatar',
            tabBarButton: () => null,    // hide from tab bar
          }}
        />
        <Tab.Screen
          name="addHabit"
          component={AddHabitPresenter}
          options={{
            title: 'Add Habit',
            //tabBarIcon: () => <Text>📝</Text>,
            tabBarButton: () => null, // Hides the tab
          }}
        />
        <Tab.Screen
          name="habit"
          component={HabitPresenter}
          options={{
            title: 'Habit',
            tabBarIcon: () => <Text>📝</Text>,
          }}
        />
        <Tab.Screen
          name="habitTracker"
          component={HabitTrackerPresenter}
          options={{
            title: 'Habit Tracker',
            tabBarButton: () => null,
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
            //tabBarIcon: () => <Text>✏️</Text>,
            tabBarButton: () => null,
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
