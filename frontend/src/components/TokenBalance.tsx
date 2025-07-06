import React from "react";

export default function TokenBalance() {
  // 실제 잔액 연동 전 임시 값
  const balance = 0;
  return (
    <div className="flex items-center gap-2 bg-blue-50 rounded px-4 py-2 text-blue-800 font-semibold">
      <span>내 Healing Token 잔액:</span>
      <span className="text-lg">{balance} HEAL</span>
    </div>
  );
} 