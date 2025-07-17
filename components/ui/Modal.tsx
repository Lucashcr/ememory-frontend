import { X } from 'lucide-react-native';
import React from 'react';
import {
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';
import Button from './Button';

interface ModalHeaderProps {
  title: string;
  onClose?: () => void;
  style?: ViewStyle;
}

export function ModalHeader({ title, onClose, style }: ModalHeaderProps) {
  return (
    <View style={[styles.modalHeader, style]}>
      <Text style={styles.modalTitle}>{title}</Text>
      {onClose && (
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <X size={24} color="#64748b" />
        </TouchableOpacity>
      )}
    </View>
  );
}

interface ModalFooterProps {
  onCancel?: () => void;
  onConfirm: () => void;
  cancelText?: string;
  confirmText?: string;
  style?: ViewStyle;
  loading?: boolean;
  danger?: boolean;
}

export function ModalFooter({
  onCancel,
  onConfirm,
  cancelText = 'Cancelar',
  confirmText = 'Confirmar',
  style,
  loading,
  danger,
}: ModalFooterProps) {
  return (
    <View style={[styles.modalFooter, style]}>
      {onCancel && (
        <Button
          variant="secondary"
          onPress={onCancel}
          style={styles.footerButton}
        >
          {cancelText}
        </Button>
      )}
      <Button
        variant={danger ? 'danger' : 'primary'}
        onPress={onConfirm}
        style={styles.footerButton}
        disabled={loading}
      >
        {confirmText}
      </Button>
    </View>
  );
}

interface ModalContainerProps {
  visible: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  style?: ViewStyle;
}

export function ModalContainer({
  visible,
  onClose,
  children,
  style,
}: ModalContainerProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, style]}>{children}</View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '100%',
    maxWidth: 500,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  closeButton: {
    padding: 4,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    gap: 8,
  },
  footerButton: {
    flex: 1,
  },
});
