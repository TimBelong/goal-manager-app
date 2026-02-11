import React, { useState, useEffect, useRef } from 'react';
import {
  TextInput,
  Modal,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Keyboard,
  InteractionManager,
  ScrollView,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { borderRadius, fontSize, spacing, shadow } from '../../theme/styles';

interface InputModalProps {
  visible: boolean;
  placeholder?: string;
  onSubmit: (text: string) => void;
  onClose: () => void;
}

export function InputModal({ visible, placeholder, onSubmit, onClose }: InputModalProps) {
  const { colors } = useTheme();
  const [text, setText] = useState('');
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (!visible) {
      setText('');
    }
  }, [visible]);

  const handleModalShow = () => {
    InteractionManager.runAfterInteractions(() => {
      inputRef.current?.focus();
    });
  };

  const handleSubmit = () => {
    if (text.trim()) {
      Keyboard.dismiss();
      onSubmit(text.trim());
      setText('');
      onClose();
    }
  };

  const handleClose = () => {
    Keyboard.dismiss();
    setText('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onShow={handleModalShow}>
      <Pressable style={styles.overlay} onPress={handleClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={[styles.container, shadow.lg, { backgroundColor: colors.bgSecondary }]}
          >
            <TextInput
              ref={inputRef}
              value={text}
              onChangeText={setText}
              placeholder={placeholder}
              placeholderTextColor={colors.textMuted}
              style={[
                styles.input,
                {
                  backgroundColor: colors.bgTertiary,
                  color: colors.textPrimary,
                  borderColor: colors.borderColor,
                },
              ]}
              onSubmitEditing={handleSubmit}
              returnKeyType="done"
              autoFocus
              showSoftInputOnFocus
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  keyboardView: {
    width: '100%',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    paddingBottom: Platform.OS === 'ios' ? spacing.xl : spacing.md,
    gap: spacing.sm,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    fontSize: fontSize.md,
  },
});
