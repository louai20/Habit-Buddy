import HabitPresenter from "../../presenters/habitPresenter";
import { View } from "react-native";

export default function HabitPage() {
    return (
      <View style={{ flex: 1, padding: 20 }}>
        <HabitPresenter />
      </View>
    );
  }