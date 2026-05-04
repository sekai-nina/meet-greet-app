import { useEffect, useState } from 'react';
import type { FC } from 'react';
import { FlatList, Modal, Text, TouchableOpacity, View } from 'react-native';

type MemberItem = {
  id: string;
  name: string;
  generation: number;
};

type MemberPickerModalProps = {
  isVisible: boolean;
  onClose: () => void;
  onSelect: (memberId: string, memberName: string) => void;
  members: MemberItem[];
  selectedMemberId: string | null;
};

const GENERATION_LABELS = ['2期生', '3期生', '4期生', '5期生'];
const GENERATIONS = [2, 3, 4, 5];

export const MemberPickerModal: FC<MemberPickerModalProps> = ({
  isVisible,
  onClose,
  onSelect,
  members,
  selectedMemberId,
}) => {
  const [activeGen, setActiveGen] = useState(
    () => {
      const selected = members.find((m) => m.id === selectedMemberId);
      return selected?.generation ?? 4;
    },
  );

  useEffect(() => {
    if (isVisible) {
      const selected = members.find((m) => m.id === selectedMemberId);
      if (selected) {
        setActiveGen(selected.generation);
      }
    }
  }, [isVisible, selectedMemberId, members]);

  const filteredMembers = members.filter((m) => m.generation === activeGen);

  const handleSelect = (member: MemberItem) => {
    onSelect(member.id, member.name);
    onClose();
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        className="flex-1 bg-black/30 justify-center"
        activeOpacity={1}
        onPress={onClose}
      >
        <View
          className="mx-6 rounded-2xl bg-white shadow-2xl overflow-hidden"
          onStartShouldSetResponder={() => true}
        >
          {/* Header */}
          <View className="flex-row items-center justify-between px-5 py-3 border-b border-divider">
            <Text className="text-lg font-bold text-text">メンバー選択</Text>
            <TouchableOpacity onPress={onClose} accessibilityLabel="閉じる">
              <Text className="text-2xl text-gray-400">✕</Text>
            </TouchableOpacity>
          </View>

          {/* Generation tabs */}
          <View className="flex-row border-b border-divider">
            {GENERATIONS.map((gen, i) => {
              const isActive = gen === activeGen;
              return (
                <TouchableOpacity
                  key={gen}
                  className={`flex-1 py-3 items-center ${isActive ? 'border-b-2 border-primary' : ''}`}
                  onPress={() => setActiveGen(gen)}
                >
                  <Text
                    className={`text-sm font-medium ${isActive ? 'text-primary' : 'text-text-muted'}`}
                  >
                    {GENERATION_LABELS[i]}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Member list */}
          <FlatList
            data={filteredMembers}
            keyExtractor={(item) => item.id}
            style={{ maxHeight: 320 }}
            renderItem={({ item }) => {
              const isSelected = item.id === selectedMemberId;
              return (
                <TouchableOpacity
                  className={`flex-row items-center px-5 py-3.5 border-b border-divider ${isSelected ? 'bg-primary-soft' : ''}`}
                  onPress={() => handleSelect(item)}
                >
                  <Text className="text-base text-text flex-1">
                    {item.name}
                  </Text>
                  {isSelected && (
                    <Text className="text-primary text-lg">✓</Text>
                  )}
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );
};
