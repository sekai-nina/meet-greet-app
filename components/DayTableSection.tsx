import type { FC } from 'react';
import { Text, View } from 'react-native';

import type { HeatmapCellData } from './HeatmapGrid';
import { HeatmapGrid } from './HeatmapGrid';
import { MemberFilterDropdown } from './MemberFilterDropdown';

type DayLabel = {
  id: string;
  label: string;
  subLabel?: string;
  color?: 'blue' | 'red' | 'default';
};

type HeatmapTableData = {
  format: string;
  title: string;
  dayLabels: DayLabel[];
  slotCount: number;
  cells: HeatmapCellData[];
};

type MemberOption = {
  id: string;
  name: string;
};

type DayTableSectionProps = {
  tables: HeatmapTableData[];
  members: MemberOption[];
  selectedMemberId: string | null;
  onSelectMember: (id: string | null) => void;
};

export const DayTableSection: FC<DayTableSectionProps> = ({
  tables,
  members,
  selectedMemberId,
  onSelectMember,
}) => (
  <View className="mx-4 mt-4 mb-24">
    <View className="flex-row items-center justify-between mb-3">
      <Text className="text-lg font-bold text-text">申し込み状況</Text>
      <MemberFilterDropdown
        members={members}
        selectedMemberId={selectedMemberId}
        onSelect={onSelectMember}
      />
    </View>
    {tables.length === 0 ? (
      <View className="rounded-xl border border-border bg-white p-4">
        <Text className="text-sm text-text-muted text-center">
          データがありません
        </Text>
      </View>
    ) : (
      tables.map((table) => (
        <HeatmapGrid
          key={table.format}
          title={table.title}
          dayLabels={table.dayLabels}
          slotCount={table.slotCount}
          cells={table.cells}
        />
      ))
    )}
  </View>
);
