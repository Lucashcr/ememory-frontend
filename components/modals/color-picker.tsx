import React, { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { runOnJS } from 'react-native-reanimated';
import ReanimatedColorPicker, { HueSlider, Panel1 } from 'reanimated-color-picker';

interface ColorPickerModalProps {
  visible: boolean;
  initialColor: string;
  onSelect: (color: string) => void;
  onClose: () => void;
}

const ColorPickerModal: React.FC<ColorPickerModalProps> = ({ visible, initialColor, onSelect, onClose }) => {
  const [tempColor, setTempColor] = useState(initialColor);

  useEffect(() => {
    if (visible) setTempColor(initialColor);
  }, [visible, initialColor]);

  const handleColorChange = (setTempColor: (color: string) => void) => {
    return (color: { hex: string }) => {
      'worklet';
      runOnJS(setTempColor)(color.hex);
    };
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <ReanimatedColorPicker
            value={tempColor}
            onChange={handleColorChange(setTempColor)}
            style={styles.picker}
          >
            <Panel1 style={styles.panel} />
            <HueSlider style={styles.hueSlider} />
          </ReanimatedColorPicker>
          <View style={styles.buttonRow}>
            <Pressable
              style={[styles.closeButton, styles.selectButton]}
              onPress={() => onSelect(tempColor)}
            >
              <Text style={styles.buttonText}>Selecionar</Text>
            </Pressable>
            <Pressable
              style={[styles.closeButton, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Cancelar</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    width: 300,
    height: 350,
    justifyContent: 'center',
  },
  picker: {
    width: 220,
    height: 220,
  },
  panel: {
    width: 180,
    height: 180,
    alignSelf: 'center',
  },
  hueSlider: {
    marginTop: 16,
    width: 180,
    alignSelf: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 16,
  },
  closeButton: {
    backgroundColor: '#6366f1',
    padding: 10,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center',
    width: 120,
  },
  selectButton: {
    backgroundColor: '#6366f1',
    marginRight: 8,
  },
  cancelButton: {
    backgroundColor: '#64748b',
  },
  buttonText: {
    color: '#fff',
  },
});

export default ColorPickerModal;
