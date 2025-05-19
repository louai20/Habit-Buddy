import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function CustomTabBar({ state, descriptors, navigation }) {
  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        // Only show icons for main tabs, but keep the bar visible
        const showTab = ['dashboard', 'habit', 'progress'].includes(route.name);

        if (!showTab) return null;

        // Render the icon if provided
        const Icon = options.tabBarIcon ? options.tabBarIcon({ focused: isFocused, color: isFocused ? '#673ab7' : '#222', size: 24 }) : null;

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            onPress={() => navigation.navigate(route.name)}
            style={styles.tab}
          >
            {Icon}
            <Text style={{ color: isFocused ? '#673ab7' : '#222', fontSize: 12 }}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    height: 60,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});