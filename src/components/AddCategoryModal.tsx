import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius } from '../constants/theme';
import { useMoney } from '../context/MoneyContext';
import { useAlert } from '../context/AlertContext';
import { Category } from '../types';
import { IconPickerModal } from './IconPickerModal';
import { useSmoothKeyboard } from '../hooks/useSmoothKeyboard';

interface AddCategoryModalProps {
  visible: boolean;
  initialType?: 'expense' | 'income';
  onClose: () => void;
  onCategoryCreated?: (newCategory: Category) => void;
}

export const AddCategoryModal: React.FC<AddCategoryModalProps> = ({
  visible,
  initialType = 'expense',
  onClose,
  onCategoryCreated,
}) => {
  const { addCategory } = useMoney();
  const { showAlert } = useAlert();

  useSmoothKeyboard();

  const [name, setName] = useState('');
  const [type, setType] = useState<'expense' | 'income'>(initialType);
  const [selectedColor, setSelectedColor] = useState<string>(Colors.presetPalette[0]);
  const [selectedIcon, setSelectedIcon] = useState<string>('cart');
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      showAlert({
        title: 'Perhatian',
        message: 'Nama kategori wajib diisi ya.',
        type: 'warning',
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const created = await addCategory({
        name: name.trim(),
        type,
        color: selectedColor,
        icon: selectedIcon,
      });

      setName('');
      if (onCategoryCreated) {
        onCategoryCreated(created);
      }
      onClose();
    } catch (err) {
      showAlert({
        title: 'Gagal',
        message: 'Terjadi kesalahan saat menyimpan kategori.',
        type: 'danger',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.overlay}>
          <TouchableOpacity
            style={styles.backdropTouchable}
            activeOpacity={1}
            onPress={() => {
              Keyboard.dismiss();
              onClose();
            }}
          />
          <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Buat Kategori Baru</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <Ionicons name="close" size={20} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="on-drag"
              contentContainerStyle={{ paddingBottom: Spacing.md }}
            >
            {/* Live Preview Card */}
            <View style={styles.previewCard}>
              <View
                style={[
                  styles.previewIconCircle,
                  { backgroundColor: `${selectedColor}22` },
                ]}
              >
                <Ionicons
                  name={(selectedIcon as any) || 'pricetag'}
                  size={26}
                  color={selectedColor}
                />
              </View>
              <View style={styles.previewMeta}>
                <Text style={styles.previewName}>
                  {name.trim() || 'Nama Kategori'}
                </Text>
                <Text style={styles.previewType}>
                  {type === 'expense' ? 'Kategori Pengeluaran' : 'Kategori Pemasukan'}
                </Text>
              </View>
            </View>

            {/* Type Switcher */}
            <Text style={styles.inputLabel}>TIPE KATEGORI</Text>
            <View style={styles.typeSwitcher}>
              <TouchableOpacity
                style={[
                  styles.typeBtn,
                  type === 'expense' && styles.typeBtnActiveExpense,
                ]}
                onPress={() => setType('expense')}
              >
                <Text
                  style={[
                    styles.typeBtnText,
                    type === 'expense' && styles.typeBtnTextActive,
                  ]}
                >
                  Pengeluaran
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.typeBtn,
                  type === 'income' && styles.typeBtnActiveIncome,
                ]}
                onPress={() => setType('income')}
              >
                <Text
                  style={[
                    styles.typeBtnText,
                    type === 'income' && styles.typeBtnTextActive,
                  ]}
                >
                  Pemasukan
                </Text>
              </TouchableOpacity>
            </View>

            {/* Category Name Input */}
            <Text style={styles.inputLabel}>NAMA KATEGORI</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.textInput}
                placeholder="misal: Pendidikan, Belanja Bulanan, Kopi..."
                placeholderTextColor={Colors.textTertiary}
                value={name}
                onChangeText={setName}
              />
            </View>

            {/* Icon Picker Trigger */}
            <Text style={styles.inputLabel}>PILIH IKON</Text>
            <TouchableOpacity
              style={styles.iconSelectBtn}
              onPress={() => setShowIconPicker(true)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.iconSelectCircle,
                  { backgroundColor: `${selectedColor}22` },
                ]}
              >
                <Ionicons
                  name={(selectedIcon as any) || 'pricetag'}
                  size={20}
                  color={selectedColor}
                />
              </View>
              <Text style={styles.iconSelectText}>Ubah Template Ikon</Text>
              <Ionicons
                name="chevron-forward"
                size={16}
                color={Colors.textTertiary}
                style={{ marginLeft: 'auto' }}
              />
            </TouchableOpacity>

            {/* Color Palette */}
            <Text style={styles.inputLabel}>PILIH WARNA TEMA</Text>
            <View style={styles.paletteRow}>
              {Colors.presetPalette.map((color) => {
                const isSelected = selectedColor === color;
                return (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorDot,
                      { backgroundColor: color },
                      isSelected && styles.colorDotSelected,
                    ]}
                    onPress={() => setSelectedColor(color)}
                    activeOpacity={0.8}
                  >
                    {isSelected && (
                      <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          {/* Action Button */}
          <TouchableOpacity
            style={[styles.saveBtn, isSubmitting && { opacity: 0.7 }]}
            onPress={handleSave}
            disabled={isSubmitting}
            activeOpacity={0.8}
          >
            <Text style={styles.saveBtnText}>
              {isSubmitting ? 'Menyimpan...' : 'Simpan Kategori'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Sub Icon Picker */}
      <IconPickerModal
        visible={showIconPicker}
        selectedIcon={selectedIcon}
        onSelectIcon={setSelectedIcon}
        onClose={() => setShowIconPicker(false)}
      />
    </KeyboardAvoidingView>
  </Modal>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  backdropTouchable: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  container: {
    backgroundColor: Colors.backgroundElevated,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    padding: Spacing.xl,
    maxHeight: '90%',
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    width: '100%',
    maxWidth: 480,
    flexShrink: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  closeBtn: {
    padding: Spacing.xs,
  },
  previewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    marginBottom: Spacing.lg,
  },
  previewIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  previewMeta: {
    flex: 1,
  },
  previewName: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  previewType: {
    fontSize: Typography.sizes.xs,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  inputLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.textTertiary,
    letterSpacing: 0.8,
    fontWeight: Typography.weights.bold,
    marginBottom: Spacing.xs,
    marginTop: Spacing.sm,
  },
  typeSwitcher: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: 4,
    gap: 4,
  },
  typeBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: Radius.md,
  },
  typeBtnActiveExpense: {
    backgroundColor: Colors.expense,
  },
  typeBtnActiveIncome: {
    backgroundColor: Colors.income,
  },
  typeBtnText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
    color: Colors.textSecondary,
  },
  typeBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: Typography.weights.bold,
  },
  inputWrapper: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  textInput: {
    color: Colors.textPrimary,
    fontSize: Typography.sizes.base,
    padding: 0,
  },
  iconSelectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  iconSelectCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  iconSelectText: {
    fontSize: Typography.sizes.sm,
    color: Colors.textPrimary,
    fontWeight: Typography.weights.medium,
  },
  paletteRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginVertical: Spacing.xs,
  },
  colorDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorDotSelected: {
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  saveBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: Radius.lg,
    alignItems: 'center',
    marginTop: Spacing.lg,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
  },
});
