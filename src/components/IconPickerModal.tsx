import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius } from '../constants/theme';
import { AVAILABLE_ICONS, ICON_CATEGORIES, IconName } from '../constants/icons';

interface IconPickerModalProps {
  visible: boolean;
  selectedIcon: string;
  onSelectIcon: (iconName: string) => void;
  onClose: () => void;
}

export const IconPickerModal: React.FC<IconPickerModalProps> = ({
  visible,
  selectedIcon,
  onSelectIcon,
  onClose,
}) => {
  const [selectedGroup, setSelectedGroup] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredIcons = AVAILABLE_ICONS.filter((item) => {
    const matchesGroup =
      selectedGroup === 'Semua' || item.category === selectedGroup;
    const matchesSearch =
      !searchQuery.trim() ||
      item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGroup && matchesSearch;
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Pilih Ikon Kategori</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View style={styles.searchBar}>
            <Ionicons name="search" size={16} color={Colors.textTertiary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Cari ikon (cth: belanja, kopi, mobil)..."
              placeholderTextColor={Colors.textTertiary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={16} color={Colors.textTertiary} />
              </TouchableOpacity>
            )}
          </View>

          {/* Category Filter Pills */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterPills}
          >
            <TouchableOpacity
              style={[
                styles.filterPill,
                selectedGroup === 'Semua' && styles.filterPillActive,
              ]}
              onPress={() => setSelectedGroup('Semua')}
            >
              <Text
                style={[
                  styles.filterPillText,
                  selectedGroup === 'Semua' && styles.filterPillTextActive,
                ]}
              >
                Semua
              </Text>
            </TouchableOpacity>

            {ICON_CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.filterPill,
                  selectedGroup === cat && styles.filterPillActive,
                ]}
                onPress={() => setSelectedGroup(cat)}
              >
                <Text
                  style={[
                    styles.filterPillText,
                    selectedGroup === cat && styles.filterPillTextActive,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Icons Grid */}
          <ScrollView
            style={styles.iconScroll}
            contentContainerStyle={styles.iconGrid}
            showsVerticalScrollIndicator={false}
          >
            {filteredIcons.map((item) => {
              const isSelected = selectedIcon === item.name;
              return (
                <TouchableOpacity
                  key={item.name}
                  style={[
                    styles.iconBox,
                    isSelected && styles.iconBoxSelected,
                  ]}
                  onPress={() => {
                    onSelectIcon(item.name);
                    onClose();
                  }}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={item.name}
                    size={24}
                    color={isSelected ? Colors.primaryLight : Colors.textPrimary}
                  />
                  <Text
                    style={[
                      styles.iconLabel,
                      isSelected && styles.iconLabelSelected,
                    ]}
                    numberOfLines={1}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: Colors.backgroundElevated,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    padding: Spacing.xl,
    maxHeight: '85%',
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
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
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: Typography.sizes.sm,
    paddingVertical: 0,
  },
  filterPills: {
    gap: Spacing.xs,
    paddingVertical: Spacing.xs,
    marginBottom: Spacing.md,
  },
  filterPill: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  filterPillActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterPillText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    fontWeight: Typography.weights.medium,
  },
  filterPillTextActive: {
    color: '#FFFFFF',
    fontWeight: Typography.weights.bold,
  },
  iconScroll: {
    maxHeight: 380,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    paddingBottom: Spacing.xl,
  },
  iconBox: {
    width: '22%',
    aspectRatio: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  iconBoxSelected: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
  },
  iconLabel: {
    fontSize: 9,
    color: Colors.textTertiary,
    marginTop: 4,
    textAlign: 'center',
  },
  iconLabelSelected: {
    color: Colors.primaryLight,
    fontWeight: Typography.weights.bold,
  },
});
