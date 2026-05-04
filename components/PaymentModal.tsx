import { useState } from 'react';
import type { FC } from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';

import type { PaymentEstimate } from '@/hooks/use-payment-estimate';

type PaymentModalProps = {
  isVisible: boolean;
  onClose: () => void;
  estimate: PaymentEstimate | null;
  serialUnitPrice?: number;
};

const DEFAULT_SERIAL_UNIT_PRICE = 2000;

export const PaymentModal: FC<PaymentModalProps> = ({
  isVisible,
  onClose,
  estimate,
  serialUnitPrice = DEFAULT_SERIAL_UNIT_PRICE,
}) => {
  const [serialCount, setSerialCount] = useState(0);

  const serialCost = serialCount * serialUnitPrice;
  const confirmedPayment = estimate?.confirmedPayment ?? 0;
  const estimatedPayment = estimate?.estimatedPayment ?? 0;
  const totalEstimate = serialCost + confirmedPayment + estimatedPayment;

  const handleIncrement = () => setSerialCount((c) => c + 1);
  const handleDecrement = () => setSerialCount((c) => Math.max(0, c - 1));

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/30">
        <View className="bg-white rounded-t-3xl">
          {/* Handle bar */}
          <View className="items-center pt-3 pb-1">
            <View className="w-10 h-1 rounded-full bg-gray-300" />
          </View>

          {/* Header */}
          <View className="flex-row items-center justify-between px-5 py-3 border-b border-divider">
            <Text className="text-lg font-bold text-text">
              費用見積もり
            </Text>
            <TouchableOpacity onPress={onClose} accessibilityLabel="閉じる">
              <Text className="text-2xl text-gray-400">✕</Text>
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View className="px-5 py-4">
            {/* Total card */}
            <View className="rounded-xl bg-surface p-4 mb-4">
              <Text className="text-sm text-gray-600">合計見積もり金額</Text>
              <Text className="text-3xl font-bold text-text mt-1">
                ¥{totalEstimate.toLocaleString()}
              </Text>
              <Text className="text-xs text-text-muted mt-1">
                確定分 + 見込み分
              </Text>
            </View>

            {/* Serial count stepper */}
            <View className="rounded-xl border border-border bg-white p-4 mb-4">
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-sm font-semibold text-gray-700">
                    購入シリアル数
                  </Text>
                  <Text className="text-xs text-gray-400 mt-0.5">
                    単価 ¥{serialUnitPrice.toLocaleString()} / 枚
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <TouchableOpacity
                    className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center"
                    onPress={handleDecrement}
                    accessibilityLabel="減らす"
                  >
                    <Text className="text-lg text-gray-600">−</Text>
                  </TouchableOpacity>
                  <Text className="text-xl font-bold text-text mx-4 min-w-[24px] text-center">
                    {serialCount}
                  </Text>
                  <TouchableOpacity
                    className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center"
                    onPress={handleIncrement}
                    accessibilityLabel="増やす"
                  >
                    <Text className="text-lg text-gray-600">+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Breakdown */}
            <View className="rounded-xl border border-border bg-white p-4 mb-8">
              <Text className="text-sm font-semibold text-gray-700 mb-3">
                内訳
              </Text>
              <View className="flex-row justify-between py-2 border-b border-divider">
                <Text className="text-sm text-gray-600">シリアル購入費</Text>
                <Text className="text-sm text-text">
                  ¥{serialCost.toLocaleString()}
                </Text>
              </View>

              {/* 当選分 支払い見込み (登録ごと) */}
              <View className="py-2 border-b border-divider">
                <View className="flex-row justify-between">
                  <Text className="text-sm text-gray-600">
                    申込中 見込み分
                  </Text>
                  <Text className="text-sm text-text">
                    ¥{estimatedPayment.toLocaleString()}
                  </Text>
                </View>
                {(estimate?.memberBreakdown ?? []).map((r) => (
                  <View
                    key={`${r.memberId}-${r.memberName}`}
                    className="mt-1.5 ml-3"
                  >
                    <View className="flex-row justify-between">
                      <Text className="text-[11px] text-text-muted">
                        {r.memberName}
                      </Text>
                      <Text className="text-[11px] text-text-muted">
                        {r.appliedCount}枚 × {r.winRate}% = ¥{r.estimate.toLocaleString()}
                      </Text>
                    </View>
                    <Text className="text-[9px] text-gray-400 ml-1">
                      {r.slots
                        .map((s) => {
                          const d = new Date(s.date);
                          return `${d.getMonth() + 1}/${d.getDate()} ${s.slotNumber}部×${s.appliedCount}`;
                        })
                        .join('  ')}
                    </Text>
                  </View>
                ))}
              </View>

              <View className="flex-row justify-between py-2 border-b border-divider">
                <Text className="text-sm text-gray-600">当選確定分</Text>
                <Text className="text-sm text-text">
                  ¥{confirmedPayment.toLocaleString()}
                </Text>
              </View>
              <View className="flex-row justify-between py-2">
                <Text className="text-sm font-bold text-text">合計見積もり</Text>
                <Text className="text-sm font-bold text-text">
                  ¥{totalEstimate.toLocaleString()}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};
