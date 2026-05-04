export const FORMAT_LABELS: Record<string, string> = {
  regular_online: '通常盤 オンラインミーグリ',
  limited_online: '初回限定盤 オンラインミーグリ',
  real: 'リアルミーグリ',
};

/** 表示順: 通常盤 → リアル → 初回限定盤 */
export const FORMAT_ORDER: string[] = [
  'regular_online',
  'real',
  'limited_online',
];

export function sortByFormatOrder<T extends { format: string }>(
  items: T[],
): T[] {
  return [...items].sort(
    (a, b) =>
      (FORMAT_ORDER.indexOf(a.format) === -1
        ? 999
        : FORMAT_ORDER.indexOf(a.format)) -
      (FORMAT_ORDER.indexOf(b.format) === -1
        ? 999
        : FORMAT_ORDER.indexOf(b.format)),
  );
}

export const RECEPTION_STATUS_LABELS = {
  before: '受付前',
  active: '受付中',
  ended: '終了',
} as const;

export type ReceptionBadgeStatus = keyof typeof RECEPTION_STATUS_LABELS;

export function getReceptionStatus(
  startAt: string,
  endAt: string,
): ReceptionBadgeStatus {
  const now = Date.now();
  const start = new Date(startAt).getTime();
  const end = new Date(endAt).getTime();

  if (now < start) return 'before';
  if (now <= end) return 'active';
  return 'ended';
}
