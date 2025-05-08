import React, { useState } from 'react';
import { View, Text, Image, Button, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import AvatarPicker from '../components/avatarPicker';
import { setAvatarSeed } from '../models/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function AvatarPickerView() {
  const dispatch = useDispatch();
  const currentSeed = useSelector(s => s.auth.user?.avatarSeed || 'Easton');
  const [selectedSeed, setSelectedSeed] = useState(currentSeed);
  const navigation = useNavigation();

    const handleSave = async () => {
      // 1) update Redux
      dispatch(setAvatarSeed(selectedSeed));
      // 2) persist to device storage
      await AsyncStorage.setItem('avatarSeed', selectedSeed);
      // 3) go back to dashboard
      navigation.goBack();
    };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Your Avatar</Text>
      
      <Image
        source={{ uri: `https://api.dicebear.com/9.x/adventurer/svg?seed=${selectedSeed}` }}
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
