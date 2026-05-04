import { create } from 'zustand';

type HomeFilterState = {
  selectedMemberId: string | null;
  isPaymentModalVisible: boolean;
};

type HomeFilterActions = {
  setSelectedMemberId: (id: string | null) => void;
  setPaymentModalVisible: (visible: boolean) => void;
};

export const useHomeFilterStore = create<HomeFilterState & HomeFilterActions>(
  (set) => ({
    selectedMemberId: null,
    isPaymentModalVisible: false,
    setSelectedMemberId: (id) => set({ selectedMemberId: id }),
    setPaymentModalVisible: (visible) =>
      set({ isPaymentModalVisible: visible }),
  }),
);
