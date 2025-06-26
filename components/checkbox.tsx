import { Check } from 'lucide-react-native';
import React from 'react';
import { GestureResponderEvent, Pressable, StyleSheet, View } from 'react-native';

interface CheckboxProps {
  onPress: (event: GestureResponderEvent) => void;
  checked: boolean;
  disabled?: boolean;
}

export default function Checkbox({
  onPress,
  checked,
  disabled,
}: CheckboxProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.checkboxContainer,
        disabled && styles.checkboxContainerDisabled,
      ]}
    >
      <View
        style={[
          styles.checkbox,
          checked && styles.checkboxChecked,
          disabled && styles.checkboxDisabled,
        ]}
      >
        {checked && <Check size={16} color="#fff" />}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  checkboxContainer: {
    padding: 4,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#cbd5e1',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  checkboxContainerDisabled: {
    opacity: 0.5,
  },
  checkboxDisabled: {
    backgroundColor: '#f1f5f9',
    borderColor: '#cbd5e1',
  },
});
