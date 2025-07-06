import React from "react";

export default function EmotionForm() {
  return (
    <form className="flex flex-col gap-4 bg-white rounded-2xl shadow-lg p-8 border border-blue-100">
      <label className="font-bold text-blue-700 text-lg mb-2">오늘의 감정을 선택하세요</label>
      <select className="border-2 border-blue-200 rounded-lg px-4 py-3 text-lg focus:outline-blue-400">
        <option>기쁨</option>
        <option>슬픔</option>
        <option>화남</option>
        <option>평온</option>
        <option>우울</option>
      </select>
      <button type="submit" className="bg-blue-500 text-white rounded-xl px-6 py-3 mt-4 text-lg font-bold shadow hover:bg-blue-600 transition">감정 기록하기</button>
    </form>
  );
} 