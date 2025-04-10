import { View } from 'react-native';
import AddHabitsPresenter from '../../presenters/addHabitPresenter';

export default function AddHabitPage() {
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <AddHabitsPresenter />
    </View>
  );
}