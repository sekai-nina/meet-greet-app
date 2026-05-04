import type { FC } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type FormatToggleProps = {
  value: 'real' | 'online';
  onChange: (value: 'real' | 'online') => void;
};

export const FormatToggle: FC<FormatToggleProps> = ({ value, onChange }) => (
  <View style={styles.container}>
    <TouchableOpacity
      style={[styles.tab, value === 'real' && styles.activeTab]}
      onPress={() => onChange('real')}
    >
      <Text
        style={[styles.label, value === 'real' ? styles.activeLabel : styles.inactiveLabel]}
      >
        リアルミーグリ
      </Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={[styles.tab, value === 'online' && styles.activeTab]}
      onPress={() => onChange('online')}
    >
      <Text
        style={[styles.label, value === 'online' ? styles.activeLabel : styles.inactiveLabel]}
      >
        初回限定オンライン
      </Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  activeLabel: {
    color: '#14253A',
  },
  inactiveLabel: {
    color: '#5A6B78',
  },
});
