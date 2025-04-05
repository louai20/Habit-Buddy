import { View } from 'react-native';
import HabitsPresenter from '../../presenters/habitsPresenter';

export default function HabitsPage() {
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <HabitsPresenter />
    </View>
  );
}