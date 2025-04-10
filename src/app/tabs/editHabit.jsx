import { View } from 'react-native';
import EditHabitPresenter from '../../presenters/editHabitPresenter';

export default function EditHabitPage() {
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <EditHabitPresenter />
    </View>
  );
}