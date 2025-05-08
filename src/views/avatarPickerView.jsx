import React, { useState } from 'react';
import { View, Text, Image, Button, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import AvatarPicker from '../components/AvatarPicker';
import { setAvatarSeed } from '../models/authSlice';

export default function AvatarPickerView() {
  const dispatch = useDispatch();
  const currentSeed = useSelector((state) => state.auth.user?.avatarSeed || 'Sarah');
  const [selectedSeed, setSelectedSeed] = useState(currentSeed);

  const handleSave = () => {
    dispatch(setAvatarSeed(selectedSeed));
    alert('Avatar updated!');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Your Avatar</Text>
      
      <Image
        source={{ uri: `https://api.dicebear.com/7.x/adventurer-neutral/png?seed=${selectedSeed}` }}
        style={styles.preview}
      />

      <AvatarPicker onSelect={setSelectedSeed} />

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
