import React from "react";

interface EggCardProps {
  emotion?: string;
  evolution?: number;
  isHatching?: boolean;
}

export default function EggCard({ emotion = "기쁨", evolution = 1, isHatching = false }: EggCardProps) {
  // 감정에 따른 알 색상 결정
  const getEggColor = (emotion: string) => {
    switch (emotion) {
      case "행복":
        return "#FFE5B4"; // 연노랑
      case "우울":
        return "#E6F3FF"; // 연파랑
      case "분노":
        return "#FFE6E6"; // 연빨강
      case "불안":
        return "#FFF2E6"; // 연주황
      case "설렘":
        return "#E6FFE6"; // 연초록
      case "지루함":
        return "#F0E6FF"; // 연보라
      case "허무":
        return "#F5F5F5"; // 연회색
      default:
        return "#FFE5B4";
    }
  };

  const eggColor = getEggColor(emotion);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100">
      <div className="font-bold text-blue-700 text-lg mb-4">나의 MoodiPet 알</div>
      
      {/* 알 일러스트 */}
      <div className="flex justify-center mb-4">
        <div className="relative">
          <svg width="120" height="160" viewBox="0 0 120 160">
            {/* 알 본체 */}
            <ellipse
              cx="60"
              cy="80"
              rx="50"
              ry="70"
              fill={eggColor}
              stroke="#D4A574"
              strokeWidth="2"
            />
            
            {/* 알 표면 패턴 */}
            <ellipse
              cx="60"
              cy="70"
              rx="25"
              ry="15"
              fill="rgba(255,255,255,0.3)"
            />
            
            {/* 알 중앙 반짝임 효과 */}
            <circle
              cx="55"
              cy="65"
              r="3"
              fill="rgba(255,255,255,0.6)"
            />
            
            {/* 부화 중일 때 균열 효과 */}
            {isHatching && (
              <>
                <path
                  d="M 45 60 Q 60 80 75 60"
                  stroke="#D4A574"
                  strokeWidth="1"
                  fill="none"
                />
                <path
                  d="M 40 70 Q 60 90 80 70"
                  stroke="#D4A574"
                  strokeWidth="1"
                  fill="none"
                />
              </>
            )}
          </svg>
        </div>
      </div>
      
      {/* 알 정보 */}
      <div className="text-center space-y-2">
        <div className="text-sm text-gray-600">현재 감정: <span className="font-semibold text-blue-600">{emotion}</span></div>
        <div className="text-sm text-gray-600">진화 단계: <span className="font-semibold text-green-600">{evolution}</span></div>
        {isHatching && (
          <div className="text-sm text-orange-600 font-semibold animate-pulse">
            🐣 부화 중...
          </div>
        )}
      </div>
      
      {/* 알 상태 안내 */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-700">
          감정을 기록하면 알이 성장하고, 충분한 감정 기록 후 슬라임으로 부화됩니다!
        </p>
      </div>
    </div>
  );
} 