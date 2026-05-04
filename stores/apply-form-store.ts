import { create } from 'zustand';

export type SlotEntry = {
  eventSlotId: string;
  eventDayId: string;
  dayNumber: number;
  slotNumber: number;
  count: number;
};

export type MemberApplication = {
  memberId: string;
  memberName: string;
  slots: SlotEntry[];
};

type ApplyFormState = {
  // 共通
  receptionRoundId: string | null;
  roundNumber: number;
  eventId: string | null;
  cdType: 'regular' | 'limited' | null;

  // 通常盤: メンバー別の申込
  regularApplications: Map<string, MemberApplication>;
  currentMemberId: string | null;

  // 初回限定盤: オンライン + リアル
  limitedOnlineSlots: SlotEntry[];
  limitedRealSlots: SlotEntry[];
  limitedMemberId: string | null;
  limitedMemberName: string;
  limitedFormType: 'online' | 'real';

  // 予想当選割合 (H5a)
  expectedWinRates: Map<string, number>;
};

type ApplyFormActions = {
  reset: () => void;
  setReceptionRound: (id: string, roundNumber: number) => void;
  setEventId: (id: string) => void;
  setCdType: (cdType: 'regular' | 'limited') => void;

  // 通常盤
  setCurrentMember: (memberId: string, memberName: string) => void;
  setSlotCount: (
    memberId: string,
    memberName: string,
    slot: Omit<SlotEntry, 'count'>,
    count: number,
  ) => void;

  // 初回限定盤
  setLimitedMember: (memberId: string, memberName: string) => void;
  setLimitedFormType: (type: 'online' | 'real') => void;
  setLimitedSlotCount: (
    type: 'online' | 'real',
    slot: Omit<SlotEntry, 'count'>,
    count: number,
  ) => void;

  // 予想当選割合
  setExpectedWinRate: (memberId: string, rate: number) => void;

  // 集計
  getTotalAppliedCount: () => number;
  getRegularApplicationsList: () => MemberApplication[];
};

function createInitialState(): ApplyFormState {
  return {
    receptionRoundId: null,
    roundNumber: 1,
    eventId: null,
    cdType: null,
    regularApplications: new Map(),
    currentMemberId: null,
    limitedOnlineSlots: [],
    limitedRealSlots: [],
    limitedMemberId: null,
    limitedMemberName: '',
    limitedFormType: 'real',
    expectedWinRates: new Map(),
  };
}

export const useApplyFormStore = create<ApplyFormState & ApplyFormActions>(
  (set, get) => ({
    ...createInitialState(),

    reset: () => set(createInitialState()),

    setReceptionRound: (id, roundNumber) =>
      set({
        receptionRoundId: id,
        roundNumber,
        // 受付次を変更したら入力内容をリセット
        regularApplications: new Map(),
        limitedOnlineSlots: [],
        limitedRealSlots: [],
        expectedWinRates: new Map(),
      }),

    setEventId: (id) => set({ eventId: id }),

    setCdType: (cdType) => set({ cdType }),

    setCurrentMember: (memberId, _memberName) =>
      set({ currentMemberId: memberId }),

    setSlotCount: (memberId, memberName, slot, count) => {
      const apps = new Map(get().regularApplications);
      const existing = apps.get(memberId) ?? {
        memberId,
        memberName,
        slots: [],
      };

      const slotIdx = existing.slots.findIndex(
        (s) => s.eventSlotId === slot.eventSlotId,
      );

      if (count === 0) {
        if (slotIdx >= 0) {
          existing.slots.splice(slotIdx, 1);
        }
      } else if (slotIdx >= 0) {
        existing.slots[slotIdx] = { ...slot, count };
      } else {
        existing.slots.push({ ...slot, count });
      }

      if (existing.slots.length === 0) {
        apps.delete(memberId);
      } else {
        apps.set(memberId, existing);
      }

      set({ regularApplications: apps });
    },

    setLimitedMember: (memberId, memberName) =>
      set({ limitedMemberId: memberId, limitedMemberName: memberName }),

    setLimitedFormType: (type) => set({ limitedFormType: type }),

    setLimitedSlotCount: (type, slot, count) => {
      const key =
        type === 'online' ? 'limitedOnlineSlots' : 'limitedRealSlots';
      const slots = [...get()[key]];

      const idx = slots.findIndex((s) => s.eventSlotId === slot.eventSlotId);
      if (count === 0) {
        if (idx >= 0) slots.splice(idx, 1);
      } else if (idx >= 0) {
        slots[idx] = { ...slot, count };
      } else {
        slots.push({ ...slot, count });
      }

      set({ [key]: slots });
    },

    setExpectedWinRate: (memberId, rate) => {
      const rates = new Map(get().expectedWinRates);
      rates.set(memberId, rate);
      set({ expectedWinRates: rates });
    },

    getTotalAppliedCount: () => {
      const { regularApplications, limitedOnlineSlots, limitedRealSlots } =
        get();
      let total = 0;
      for (const app of regularApplications.values()) {
        total += app.slots.reduce((sum, s) => sum + s.count, 0);
      }
      total += limitedOnlineSlots.reduce((sum, s) => sum + s.count, 0);
      total += limitedRealSlots.reduce((sum, s) => sum + s.count, 0);
      return total;
    },

    getRegularApplicationsList: () => [
      ...get().regularApplications.values(),
    ],
  }),
);
