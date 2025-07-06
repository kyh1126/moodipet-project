import React from "react";

interface PetCardProps {
  emotion?: string;
  evolution?: number;
  personality?: string;
  createdAt?: string;
}

export default function PetCard({ 
  emotion = "기쁨", 
  evolution = 2, 
  personality = "고양이",
  createdAt = "2024-06-01"
}: PetCardProps) {
  // 감정에 따른 펫 색상과 표정 결정
  const getPetStyle = (emotion: string) => {
    switch (emotion) {
      case "기쁨":
        return {
          color: "#FFD700", // 노랑
          expression: "happy",
          eyeColor: "#4A90E2"
        };
      case "슬픔":
        return {
          color: "#87CEEB", // 하늘색
          expression: "sad",
          eyeColor: "#6B7280"
        };
      case "화남":
        return {
          color: "#FF6B6B", // 빨강
          expression: "angry",
          eyeColor: "#DC2626"
        };
      case "평온":
        return {
          color: "#98FB98", // 연초록
          expression: "calm",
          eyeColor: "#10B981"
        };
      case "우울":
        return {
          color: "#DDA0DD", // 연보라
          expression: "depressed",
          eyeColor: "#8B5CF6"
        };
      default:
        return {
          color: "#FFD700",
          expression: "happy",
          eyeColor: "#4A90E2"
        };
    }
  };

  const petStyle = getPetStyle(emotion);

  // 펫 표정 렌더링
  const renderPetExpression = (expression: string) => {
    switch (expression) {
      case "happy":
        return (
          <>
            {/* 기쁜 눈 */}
            <circle cx="35" cy="45" r="3" fill={petStyle.eyeColor} />
            <circle cx="65" cy="45" r="3" fill={petStyle.eyeColor} />
            {/* 기쁜 입 (웃음) */}
            <path d="M 40 60 Q 50 70 60 60" stroke="#FF6B9D" strokeWidth="2" fill="none" />
          </>
        );
      case "sad":
        return (
          <>
            {/* 슬픈 눈 */}
            <circle cx="35" cy="45" r="3" fill={petStyle.eyeColor} />
            <circle cx="65" cy="45" r="3" fill={petStyle.eyeColor} />
            {/* 슬픈 입 (우는 표정) */}
            <path d="M 40 70 Q 50 60 60 70" stroke="#FF6B9D" strokeWidth="2" fill="none" />
          </>
        );
      case "angry":
        return (
          <>
            {/* 화난 눈 */}
            <circle cx="35" cy="45" r="3" fill={petStyle.eyeColor} />
            <circle cx="65" cy="45" r="3" fill={petStyle.eyeColor} />
            {/* 화난 입 */}
            <path d="M 40 65 L 60 65" stroke="#FF6B9D" strokeWidth="2" />
          </>
        );
      case "calm":
        return (
          <>
            {/* 평온한 눈 */}
            <circle cx="35" cy="45" r="3" fill={petStyle.eyeColor} />
            <circle cx="65" cy="45" r="3" fill={petStyle.eyeColor} />
            {/* 평온한 입 */}
            <path d="M 40 65 Q 50 65 60 65" stroke="#FF6B9D" strokeWidth="2" fill="none" />
          </>
        );
      case "depressed":
        return (
          <>
            {/* 우울한 눈 */}
            <circle cx="35" cy="45" r="3" fill={petStyle.eyeColor} />
            <circle cx="65" cy="45" r="3" fill={petStyle.eyeColor} />
            {/* 우울한 입 */}
            <path d="M 40 70 Q 50 65 60 70" stroke="#FF6B9D" strokeWidth="2" fill="none" />
          </>
        );
      default:
        return (
          <>
            <circle cx="35" cy="45" r="3" fill={petStyle.eyeColor} />
            <circle cx="65" cy="45" r="3" fill={petStyle.eyeColor} />
            <path d="M 40 60 Q 50 70 60 60" stroke="#FF6B9D" strokeWidth="2" fill="none" />
          </>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100">
      <div className="font-bold text-blue-700 text-lg mb-4">나의 MoodiPet</div>
      
      {/* 펫 일러스트 */}
      <div className="flex justify-center mb-4">
        <div className="relative">
          <svg width="120" height="120" viewBox="0 0 120 120">
            {/* 고양이 머리 */}
            <circle
              cx="60"
              cy="60"
              r="40"
              fill={petStyle.color}
              stroke="#8B4513"
              strokeWidth="2"
            />
            
            {/* 고양이 귀 */}
            <path d="M 30 30 L 25 15 L 35 25 Z" fill={petStyle.color} stroke="#8B4513" strokeWidth="1" />
            <path d="M 90 30 L 95 15 L 85 25 Z" fill={petStyle.color} stroke="#8B4513" strokeWidth="1" />
            
            {/* 고양이 표정 */}
            {renderPetExpression(petStyle.expression)}
            
            {/* 고양이 코 */}
            <circle cx="50" cy="55" r="2" fill="#FF6B9D" />
            
            {/* 고양이 수염 */}
            <line x1="25" y1="50" x2="15" y2="45" stroke="#8B4513" strokeWidth="1" />
            <line x1="25" y1="55" x2="15" y2="55" stroke="#8B4513" strokeWidth="1" />
            <line x1="25" y1="60" x2="15" y2="65" stroke="#8B4513" strokeWidth="1" />
            <line x1="95" y1="50" x2="105" y2="45" stroke="#8B4513" strokeWidth="1" />
            <line x1="95" y1="55" x2="105" y2="55" stroke="#8B4513" strokeWidth="1" />
            <line x1="95" y1="60" x2="105" y2="65" stroke="#8B4513" strokeWidth="1" />
          </svg>
        </div>
      </div>
      
      {/* 펫 정보 */}
      <div className="space-y-2 text-center">
        <div className="text-sm text-gray-600">감정: <span className="font-semibold text-blue-600">{emotion}</span></div>
        <div className="text-sm text-gray-600">진화 단계: <span className="font-semibold text-green-600">{evolution}</span></div>
        <div className="text-sm text-gray-600">성격: <span className="font-semibold text-purple-600">{personality}</span></div>
        <div className="text-sm text-gray-600">생성일: <span className="font-semibold text-gray-600">{createdAt}</span></div>
      </div>
      
      {/* 펫 상태 안내 */}
      <div className="mt-4 p-3 bg-green-50 rounded-lg">
        <p className="text-sm text-green-700">
          🎉 축하합니다! 펫이 성공적으로 부화되었습니다. 계속해서 감정을 기록하여 펫을 성장시키세요!
        </p>
      </div>
    </div>
  );
} 