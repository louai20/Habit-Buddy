import React from 'react';
import { View, Text, Image, Button, StyleSheet } from 'react-native';
import AvatarPicker from '../components/avatarPicker';

export default function AvatarPickerView({
  user,
  avatarSeeds,
  selectedSeed,
  previewUri,
  handleSelect,
  handleSave
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Your Avatar</Text>

      <Image source={{ uri: previewUri }} style={styles.preview} />

      <AvatarPicker seeds={avatarSeeds} onSelect={handleSelect} />

      <View style={styles.buttonWrapper}>
        <Button title="Save Avatar" onPress={handleSave} color="#007bff" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  preview: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  buttonWrapper: {
    marginTop: 20,
  },
});
