import { connect } from 'react-redux';
import { setAvatarSeed } from '../models/authSlice';
import { UnauthorizedView } from '../views/unauthorizedView';
import AvatarPickerView from '../views/avatarPickerView';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';

const avatarSeeds = ['Easton', 'Maria', 'Sara', 'Jocelyn', 'George'];

const mapStateToProps = (state) => ({
  user: state.auth.user,
  currentSeed: state.auth.user?.avatarSeed || 'Easton',
});

const mapDispatchToProps = (dispatch) => ({
  onSetAvatarSeed: (seed) => dispatch(setAvatarSeed(seed)),
});

const AvatarPickerPresenter = ({ user, currentSeed, onSetAvatarSeed }) => {
  const navigation = useNavigation();
  const [selectedSeed, setSelectedSeed] = useState(currentSeed);

  useEffect(() => {
    setSelectedSeed(currentSeed);
  }, [currentSeed]);

  const handleSelect = (seed) => {
    setSelectedSeed(seed);
  };

  const handleSave = async () => {
    onSetAvatarSeed(selectedSeed);
    try {
      await AsyncStorage.setItem('avatarSeed', selectedSeed);
    } catch (e) {
      console.error('Failed to persist avatar seed', e);
    }
    navigation.replace('MainTabs', { screen: 'dashboard' });
  };

  if (!user?.uid) {
    return <UnauthorizedView />;
  }

  return (
    <AvatarPickerView
      user={user}
      avatarSeeds={avatarSeeds}
      selectedSeed={selectedSeed}
      previewUri={`https://api.dicebear.com/9.x/adventurer/png?seed=${selectedSeed}`}
      handleSelect={handleSelect}
      handleSave={handleSave}
    />
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(AvatarPickerPresenter);
