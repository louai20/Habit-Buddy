import HabitTrackerPresenter from "../../presenters/habitTrackerPresenter";
import { View } from "react-native";

export default function HabitTrackerPage() {
    return (
      <View style={{ flex: 1, padding: 20 }}>
        <HabitTrackerPresenter />
      </View>
    );
  }