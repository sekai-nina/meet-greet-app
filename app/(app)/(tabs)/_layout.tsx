import { Tabs } from 'expo-router';

import { TouchableOpacity } from 'react-native';

import { CalendarBlank, Gear, House, Wallet } from 'phosphor-react-native';

import { useHomeFilterStore } from '@/stores/home-filter-store';

const ICON_SIZE = 24;

function WalletButton() {
  const setPaymentModalVisible = useHomeFilterStore(
    (s) => s.setPaymentModalVisible,
  );
  return (
    <TouchableOpacity
      onPress={() => setPaymentModalVisible(true)}
      accessibilityLabel="費用見積もり"
      style={{ marginRight: 12 }}
    >
      <Wallet size={ICON_SIZE} color="#5BBEE5" />
    </TouchableOpacity>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#5BBEE5',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'ミーグリ',
          tabBarLabel: 'ホーム',
          tabBarIcon: ({ color, focused }) => (
            <House
              size={ICON_SIZE}
              color={color}
              weight={focused ? 'fill' : 'regular'}
            />
          ),
          headerRight: () => <WalletButton />,
        }}
      />
      <Tabs.Screen
        name="events/index"
        options={{
          title: 'イベント',
          tabBarIcon: ({ color, focused }) => (
            <CalendarBlank
              size={ICON_SIZE}
              color={color}
              weight={focused ? 'fill' : 'regular'}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: '設定',
          tabBarIcon: ({ color, focused }) => (
            <Gear
              size={ICON_SIZE}
              color={color}
              weight={focused ? 'fill' : 'regular'}
            />
          ),
        }}
      />
    </Tabs>
  );
}
