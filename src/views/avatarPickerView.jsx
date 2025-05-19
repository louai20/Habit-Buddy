import React, { useEffect } from 'react';
import { View, Text, Image, Button, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import AvatarPicker from '../components/avatarPicker';
import avatarPickerPresenter from '../presenters/avatarPickerPresenter';

export default function AvatarPickerView() {
  const {
    avatarSeeds,
    selectedSeed,
    previewUri,
    handleSelect,
    handleSave,
  } = avatarPickerPresenter();

  const user = useSelector(state => state.auth.user);
  const navigation = useNavigation();

  useEffect(() => {
    if (!user || !user.uid) {
      navigation.replace('login'); // Replace with your UnauthorizedView route name
    }
  }, [user, navigation]);

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