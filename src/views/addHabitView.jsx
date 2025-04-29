import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  Platform,
  StyleSheet,
  FlatList,
  ScrollView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Input } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import DropDownPicker from "react-native-dropdown-picker";

export function AddHabitView({ user, onSetHabit }) {
  const navigation = useNavigation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Add open state for DropDownPicker
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: "Daily", value: "Daily" },
    { label: "Weekly", value: "Weekly" },
    { label: "Monthly", value: "Monthly" },
  ]);

  const [habitData, setHabitData] = useState({
    name: "",
    description: "",
    frequency: "Daily", // Set default value
    startDate: new Date(),
    endDate: new Date(),
  });

  const [startDateInput, setStartDateInput] = useState(
    habitData.startDate.toISOString().split("T")[0]
  );
  const [endDateInput, setEndDateInput] = useState(
    habitData.endDate.toISOString().split("T")[0]
  );

  const [isStartPickerOpen, setIsStartPickerOpen] = useState(false);
  const [isEndPickerOpen, setIsEndPickerOpen] = useState(false);

  const handleInputChange = (field, value) => {
    setHabitData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!habitData.name.trim()) {
      if (Platform.OS === "web") {
        window.alert("Empty name");
      } else {
        Alert.alert("Empty name");
      }
      return;
    }

    const isValidDate = (str) =>
      /^\d{4}-\d{2}-\d{2}$/.test(str) && !isNaN(new Date(str).getTime());

    if (!isValidDate(startDateInput) || !isValidDate(endDateInput)) {
      if (Platform.OS === "web") {
        window.alert("Invalid Date");
      } else {
        Alert.alert("Invalid Date");
      }
      return;
    }

    const startDate = new Date(startDateInput);
    const endDate = new Date(endDateInput);

    if (endDate < startDate) {
      if (Platform.OS === "web") {
        window.alert("End date cannot be before start date.");
      } else {
        Alert.alert("End date cannot be before start date.");
      }
      return;
    }

    try {
      setIsSubmitting(true);
      const newHabit = {
        ...habitData,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      };

      await onSetHabit(newHabit, user.uid);
      if (Platform.OS === "web") {
        window.alert("Success\n\nHabit added successfully!");
      } else {
        Alert.alert("Success", "Habit added successfully!");
      }

      // Reset form data
      setHabitData({
        name: "",
        description: "",
        frequency: "",
        startDate: new Date(),
        endDate: new Date(),
      });
      navigation.navigate("dashboard");
    } catch (error) {
      if (Platform.OS === "web") {
        window.alert("Failed to add habit. Please try again.");
      } else {
        Alert.alert("Error", "Failed to add habit. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const frequencies = [
    { key: "Daily", value: "Daily" },
    { key: "Weekly", value: "Weekly" },
    { key: "Monthly", value: "Monthly" },
  ];

  // Add renderForm function before the return statement
  const renderForm = () => (
    <>
      {/* Name */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Habit Name</Text>
        <TextInput
          style={styles.input}
          value={habitData.name}
          onChangeText={(text) => handleInputChange("name", text)}
          placeholder="e.g., Meditate"
        />
      </View>

      {/* Description */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={habitData.description}
          onChangeText={(text) => handleInputChange("description", text)}
          placeholder="What is this habit about?"
          multiline
          numberOfLines={4}
        />
      </View>

      {/* Start Date */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Start Date</Text>
        {Platform.OS === "web" ? (
          <Input
            type="date"
            value={startDateInput}
            onChange={(e) => setStartDateInput(e.target.value)}
            style={styles.webDateInput}
          />
        ) : Platform.OS === "android" ? (
          <>
            <Pressable
              onPress={() => setIsStartPickerOpen(true)}
              style={styles.dateButton}
            >
              <Text style={styles.dateButtonText}>
                {startDateInput || "Select Start Date"}
              </Text>
            </Pressable>
            {isStartPickerOpen && (
              <DateTimePicker
                value={habitData.startDate}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setIsStartPickerOpen(false);
                  if (event.type === "set" && selectedDate) {
                    setStartDateInput(selectedDate.toISOString().split("T")[0]);
                    setHabitData((prev) => ({
                      ...prev,
                      startDate: selectedDate,
                    }));
                  }
                }}
              />
            )}
          </>
        ) : (
          <DateTimePicker
            value={habitData.startDate}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              if (selectedDate) {
                setStartDateInput(selectedDate.toISOString().split("T")[0]);
                setHabitData((prev) => ({
                  ...prev,
                  startDate: selectedDate,
                }));
              }
            }}
          />
        )}
      </View>

      {/* End Date */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>End Date</Text>
        {Platform.OS === "web" ? (
          <Input
            type="date"
            value={endDateInput}
            onChange={(e) => setEndDateInput(e.target.value)}
            style={styles.webDateInput}
          />
        ) : Platform.OS === "android" ? (
          <>
            <Pressable
              onPress={() => setIsEndPickerOpen(true)}
              style={styles.dateButton}
            >
              <Text style={styles.dateButtonText}>
                {endDateInput || "Select End Date"}
              </Text>
            </Pressable>
            {isEndPickerOpen && (
              <DateTimePicker
                value={habitData.endDate}
                mode="date"
                display="default"
                minimumDate={habitData.startDate}
                onChange={(event, selectedDate) => {
                  setIsEndPickerOpen(false);
                  if (event.type === "set" && selectedDate) {
                    setEndDateInput(selectedDate.toISOString().split("T")[0]);
                    setHabitData((prev) => ({ ...prev, endDate: selectedDate }));
                  }
                }}
              />
            )}
          </>
        ) : (
          <DateTimePicker
            value={habitData.endDate}
            mode="date"
            display="default"
            minimumDate={habitData.startDate}
            onChange={(event, selectedDate) => {
              if (selectedDate) {
                setEndDateInput(selectedDate.toISOString().split("T")[0]);
                setHabitData((prev) => ({ ...prev, endDate: selectedDate }));
              }
            }}
          />
        )}
      </View>

      {/* Frequency */}
      <View style={[styles.formGroup, { zIndex: 1000 }]}>
        <Text style={styles.label}>Frequency</Text>
        <DropDownPicker
          open={open}
          value={habitData.frequency}
          items={items}
          setOpen={setOpen}
          setValue={(callback) => {
            const value = callback(habitData.frequency);
            handleInputChange("frequency", value);
          }}
          setItems={setItems}
          style={styles.dropdownStyle}
          dropDownContainerStyle={styles.dropdownContainer}
          textStyle={styles.dropdownText}
          placeholder="Select frequency"
        />
      </View>

      {/* Submit */}
      <Pressable
        style={[styles.button, isSubmitting && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={isSubmitting}
      >
        <Text style={styles.buttonText}>
          {isSubmitting ? "Adding..." : "Add Habit"}
        </Text>
      </Pressable>
    </>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={[1]} // Dummy data array with one item
        renderItem={renderForm}
        keyExtractor={() => 'add-form'}
        style={styles.formScroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: "#f9fafb",
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 24,
    textAlign: "center",
    color: "#1f2937",
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontWeight: "600",
    fontSize: 16,
    color: "#374151",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    boxShadowColor: "#000",
    boxShadowOpacity: 0.04,
    boxShadowRadius: 3,
    boxShadowOffset: { width: 0, height: 2 },
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  dateButton: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    boxShadowColor: "#000",
    boxShadowOpacity: 0.04,
    boxShadowRadius: 3,
    boxShadowOffset: { width: 0, height: 2 },
  },
  dateButtonText: {
    color: "#1f2937",
    fontSize: 16,
  },
  webDateInput: {
    padding: 14,
    borderWidth: 0,
    borderColor: "#fff",
    fontSize: 16,
    backgroundColor: "#fff",
    width: "100%",
  },
  button: {
    backgroundColor: "#3b82f6",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
    boxShadowColor: "#000",
    boxShadowOpacity: 0.1,
    boxShadowRadius: 6,
    boxShadowOffset: { width: 0, height: 4 },
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
  loginMessage: {
    fontSize: 18,
    color: "#555",
    textAlign: "center",
    marginTop: 50,
  },
  buttonDisabled: {
    backgroundColor: "#93c5fd", // lighter blue when disabled
    opacity: 0.7,
  },
  dropdownStyle: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderColor: "#e5e7eb",
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  dropdownContainer: {
    backgroundColor: "#fff",
    borderColor: "#e5e7eb",
    borderWidth: 1,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dropdownText: {
    color: "#374151",
    fontSize: 16,
  },
});
