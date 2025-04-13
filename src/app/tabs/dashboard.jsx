import { View } from 'react-native';
import DashboardPresenter from '../../presenters/dashboardPresenter';

export default function DashboardPage() {
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <DashboardPresenter />
    </View>
  );
}