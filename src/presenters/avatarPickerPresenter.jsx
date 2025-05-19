import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAvatarSeed } from '../models/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const avatarSeeds = ['Easton', 'Maria', 'Sara', 'Jocelyn', 'George'];

export default function avatarPickerPresenter() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const currentSeed = useSelector(state => state.auth.user?.avatarSeed || 'Easton');
  const [selectedSeed, setSelectedSeed] = useState(currentSeed);

  // Keep local state in sync with Redux
  useEffect(() => {
    setSelectedSeed(currentSeed);
  }, [currentSeed]);

  // Called when a thumbnail is tapped
  const handleSelect = (seed) => {
    setSelectedSeed(seed);
  };

  // Save to Redux & AsyncStorage, then go back
  const handleSave = async () => {
    dispatch(setAvatarSeed(selectedSeed));
    try {
      await AsyncStorage.setItem('avatarSeed', selectedSeed);
    } catch (e) {
      console.error('Failed to persist avatar seed', e);
    }
    navigation.goBack();
  };

  // URL for preview image
  const previewUri = `https://api.dicebear.com/9.x/adventurer/png?seed=${selectedSeed}`;

  return {
    avatarSeeds,
    selectedSeed,
    previewUri,
    handleSelect,
    handleSave,
  };
}
