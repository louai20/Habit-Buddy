import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';

const avatarSeeds = ['Easton', 'Maria', 'Sara', 'Jocelyn', 'George'];

export default function AvatarPicker({ onSelect }) {
  return (
    <View style={styles.container}>
      {avatarSeeds.map((seed) => (
        <TouchableOpacity key={seed} onPress={() => onSelect(seed)}>
          <Image
            source={{ uri: `https://api.dicebear.com/9.x/adventurer/svg?seed=${seed}` }}
            style={styles.avatar}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 10,
  },
  avatar: {
    width: 60,
    height: 60,
    margin: 8,
    borderRadius: 30,
  },
});
