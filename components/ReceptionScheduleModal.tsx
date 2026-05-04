import type { FC } from 'react';
import { FlatList, Modal, Text, TouchableOpacity, View } from 'react-native';

import { MapPin, Monitor, Star } from 'phosphor-react-native';

import { FORMAT_LABELS, getReceptionStatus } from '@/lib/format-labels';

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];

type RoundItem = {
  id: string;
  roundNumber: number;
  startAt: string;
  endAt: string;
  maxApplications: number;
};

type FormatSection = {
  format: string;
  rounds: RoundItem[];
};

type ReceptionScheduleModalProps = {
  isVisible: boolean;
  onClose: () => void;
  sections: FormatSection[];
};

function formatDateRange(startAt: string, endAt: string): string {
  const fmt = (d: Date) => {
    const m = d.getMonth() + 1;
    const day = d.getDate();
    const wd = WEEKDAYS[d.getDay()];
    const h = d.getHours();
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${m}/${day} (${wd}) ${h}:${min}`;
  };
  return `${fmt(new Date(startAt))} 〜 ${fmt(new Date(endAt))}`;
}

const STATUS_BADGE: Record<string, { bg: string; text: string; label: string }> = {
  before: { bg: 'bg-primary-soft', text: 'text-slate-500', label: '受付前' },
  active: { bg: 'bg-green-100', text: 'text-green-800', label: '受付中' },
  ended: { bg: 'bg-gray-100', text: 'text-gray-500', label: '終了' },
};

const FORMAT_ICON_COMPONENTS: Record<string, React.ReactNode> = {
  regular_online: <Monitor size={20} color="#5BBEE5" />,
  limited_online: <Star size={20} color="#F59E0B" weight="fill" />,
  real: <MapPin size={20} color="#E5484D" />,
};

export const ReceptionScheduleModal: FC<ReceptionScheduleModalProps> = ({
  isVisible,
  onClose,
  sections,
}) => (
  <Modal
    visible={isVisible}
    animationType="slide"
    transparent
    onRequestClose={onClose}
  >
    <View className="flex-1 justify-end bg-black/30">
      <View className="bg-white rounded-t-3xl max-h-[80%]">
        {/* Handle bar */}
        <View className="items-center pt-3 pb-1">
          <View className="w-10 h-1 rounded-full bg-gray-300" />
        </View>

        {/* Header */}
        <View className="flex-row items-center justify-between px-5 py-3 border-b border-divider">
          <Text className="text-lg font-bold text-text">
            受付スケジュール
          </Text>
          <TouchableOpacity onPress={onClose} accessibilityLabel="閉じる">
            <Text className="text-2xl text-gray-400">✕</Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <FlatList
          data={sections}
          keyExtractor={(item) => item.format}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
          renderItem={({ item: section }) => (
            <View className="mt-4">
              <View className="flex-row items-center mb-3">
                <View className="mr-2">
                  {FORMAT_ICON_COMPONENTS[section.format] ?? null}
                </View>
                <Text className="text-base font-semibold text-gray-700">
                  {FORMAT_LABELS[section.format] ?? section.format}
                </Text>
              </View>
              {section.rounds.map((round) => {
                const status = getReceptionStatus(round.startAt, round.endAt);
                const badge = STATUS_BADGE[status];
                return (
                  <View
                    key={round.id}
                    className="flex-row items-center py-3 border-b border-divider"
                  >
                    <View className="h-7 w-7 rounded-full bg-primary items-center justify-center mr-3">
                      <Text className="text-xs font-bold text-text">
                        {round.roundNumber}次
                      </Text>
                    </View>
                    <View className="flex-1">
                      <Text className="text-sm text-gray-600">
                        {formatDateRange(round.startAt, round.endAt)}
                      </Text>
                      <Text className="text-xs text-gray-400 mt-0.5">
                        上限 {round.maxApplications}回
                      </Text>
                    </View>
                    <View className={`rounded-full px-2.5 py-0.5 ${badge.bg}`}>
                      <Text className={`text-xs font-medium ${badge.text}`}>
                        {badge.label}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        />
      </View>
    </View>
  </Modal>
);
