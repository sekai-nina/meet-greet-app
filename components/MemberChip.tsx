import type { FC } from 'react';

import { Text, View } from 'react-native';

import type { Member } from '@/types';

type Props = {
  member: Member;
};

export const MemberChip: FC<Props> = ({ member }) => {
  return (
    <View className="bg-gray-100 rounded-full px-3 py-1 mr-2 mb-2">
      <Text className="text-sm text-text">{member.name}</Text>
    </View>
  );
};
