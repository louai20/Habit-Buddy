import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Text } from 'react-native';
import DashboardPresenter from  '../../presenters/dashboardPresenter';
import ProgressPresenter from "../../presenters/progressPresenter";
import HabitPresenter from "../../presenters/habitPresenter";
// Import the screens you want to show as stack screens
import RegisterPresenter from '../../presenters/registerPresenter';
import LoginPresenter from '../../presenters/loginPresenter';
import AddHabitPresenter from '../../presenters/addHabitPresenter';
import EditHabitPresenter from '../../presenters/editHabitPresenter';
import HabitTrackerPresenter from "../../presenters/habitTrackerPresenter";
import AvatarPickerView from "../../views/avatarPickerView";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
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
        name="habit"
        component={HabitPresenter}
        options={{
          title: 'Habit',
          tabBarIcon: () => <Text>📝</Text>,
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

export default function TabsLayout() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="register" component={RegisterPresenter} />
      <Stack.Screen name="login" component={LoginPresenter} />
      <Stack.Screen name="addHabit" component={AddHabitPresenter} />
      <Stack.Screen name="editHabit" component={EditHabitPresenter} />
      <Stack.Screen name="habitTracker" component={HabitTrackerPresenter} />
      <Stack.Screen name="avatarPicker" component={AvatarPickerView} />
    </Stack.Navigator>
  );
}
