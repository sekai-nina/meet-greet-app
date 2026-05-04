import { useRef, useState } from 'react';
import type { FC } from 'react';
import {
  FlatList,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type MemberOption = {
  id: string;
  name: string;
};

type MemberFilterDropdownProps = {
  members: MemberOption[];
  selectedMemberId: string | null;
  onSelect: (memberId: string | null) => void;
};

export const MemberFilterDropdown: FC<MemberFilterDropdownProps> = ({
  members,
  selectedMemberId,
  onSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [buttonLayout, setButtonLayout] = useState({ x: 0, y: 0, w: 0, h: 0 });
  const buttonRef = useRef<View>(null);

  const selectedLabel =
    members.find((m) => m.id === selectedMemberId)?.name ?? '全員';

  const handleSelect = (id: string | null) => {
    onSelect(id);
    setIsOpen(false);
  };

  const handleOpen = () => {
    buttonRef.current?.measureInWindow((x, y, w, h) => {
      setButtonLayout({ x, y, w, h });
      setIsOpen(true);
    });
  };

  return (
    <View ref={buttonRef}>
      <TouchableOpacity
        className="flex-row items-center rounded-full bg-primary-soft px-3 py-1.5"
        onPress={handleOpen}
        accessibilityRole="button"
        accessibilityLabel={`メンバーフィルター: ${selectedLabel}`}
      >
        <Text className="text-sm text-gray-700">{selectedLabel}</Text>
        <Text className="text-xs text-gray-400 ml-1">
          {isOpen ? '▲' : '▼'}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          className="flex-1"
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View
            className="absolute rounded-xl bg-white shadow-lg min-w-[180px]"
            style={{
              top: buttonLayout.y + buttonLayout.h + 4,
              right: 16,
            }}
          >
            <FlatList
              data={[{ id: null, name: '全員' }, ...members]}
              keyExtractor={(item) => item.id ?? 'all'}
              scrollEnabled={members.length > 6}
              style={members.length > 6 ? { maxHeight: 280 } : undefined}
              renderItem={({ item }) => {
                const isSelected = item.id === selectedMemberId;
                return (
                  <TouchableOpacity
                    className={`flex-row items-center px-4 py-3 border-b border-divider ${isSelected ? 'bg-primary-soft' : ''}`}
                    onPress={() => handleSelect(item.id)}
                    accessibilityRole="menuitem"
                    accessibilityState={{ selected: isSelected }}
                  >
                    <Text className="text-base text-text flex-1">
                      {item.name}
                    </Text>
                    {isSelected && (
                      <Text className="text-primary">✓</Text>
                    )}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};
