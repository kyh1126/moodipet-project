import React from "react";

interface SlimeCardProps {
  emotion?: string;
  evolution?: number;
  ment?: string;
}

export default function SlimeCard({ emotion = "행복", evolution = 2, ment = "" }: SlimeCardProps) {
  // 감정에 따른 슬라임 색상과 표정 결정
  const getSlimeStyle = (emotion: string) => {
    switch (emotion) {
      case "행복":
        return {
          color: "#FFD700", // 골드
          eyeColor: "#333",
          mouthType: "happy",
          eyeStyle: "normal"
        };
      case "우울":
        return {
          color: "#87CEEB", // 하늘색
          eyeColor: "#333",
          mouthType: "sad",
          eyeStyle: "droopy"
        };
      case "분노":
        return {
          color: "#FF6B6B", // 빨간색
          eyeColor: "#FF0000",
          mouthType: "angry",
          eyeStyle: "angry"
        };
      case "불안":
        return {
          color: "#FFB347", // 주황색
          eyeColor: "#333",
          mouthType: "worried",
          eyeStyle: "worried"
        };
      case "설렘":
        return {
          color: "#98FB98", // 연두색
          eyeColor: "#333",
          mouthType: "excited",
          eyeStyle: "sparkly"
        };
      case "지루함":
        return {
          color: "#DDA0DD", // 연보라색
          eyeColor: "#333",
          mouthType: "bored",
          eyeStyle: "bored"
        };
      case "허무":
        return {
          color: "#D3D3D3", // 회색
          eyeColor: "#666",
          mouthType: "empty",
          eyeStyle: "empty"
        };
      default:
        return {
          color: "#B4E7FF",
          eyeColor: "#333",
          mouthType: "normal",
          eyeStyle: "normal"
        };
    }
  };

  const slimeStyle = getSlimeStyle(emotion);

  // 표정 렌더링 함수
  const renderExpression = () => {
    const { eyeStyle, mouthType } = slimeStyle;
    
    return (
      <>
        {/* 눈 */}
        {eyeStyle === "normal" && (
          <>
            <circle cx="38" cy="55" r="4" fill={slimeStyle.eyeColor} />
            <circle cx="62" cy="55" r="4" fill={slimeStyle.eyeColor} />
          </>
        )}
        {eyeStyle === "droopy" && (
          <>
            <ellipse cx="38" cy="55" rx="4" ry="2" fill={slimeStyle.eyeColor} />
            <ellipse cx="62" cy="55" rx="4" ry="2" fill={slimeStyle.eyeColor} />
          </>
        )}
        {eyeStyle === "angry" && (
          <>
            <path d="M 34 51 L 42 59 M 42 51 L 34 59" stroke={slimeStyle.eyeColor} strokeWidth="2" />
            <path d="M 58 51 L 66 59 M 66 51 L 58 59" stroke={slimeStyle.eyeColor} strokeWidth="2" />
          </>
        )}
        {eyeStyle === "worried" && (
          <>
            <ellipse cx="38" cy="53" rx="3" ry="1" fill={slimeStyle.eyeColor} />
            <ellipse cx="62" cy="53" rx="3" ry="1" fill={slimeStyle.eyeColor} />
          </>
        )}
        {eyeStyle === "sparkly" && (
          <>
            <circle cx="38" cy="55" r="4" fill={slimeStyle.eyeColor} />
            <circle cx="62" cy="55" r="4" fill={slimeStyle.eyeColor} />
            <circle cx="36" cy="53" r="1" fill="#FFF" />
            <circle cx="64" cy="53" r="1" fill="#FFF" />
          </>
        )}
        {eyeStyle === "bored" && (
          <>
            <line x1="34" y1="55" x2="42" y2="55" stroke={slimeStyle.eyeColor} strokeWidth="2" />
            <line x1="58" y1="55" x2="66" y2="55" stroke={slimeStyle.eyeColor} strokeWidth="2" />
          </>
        )}
        {eyeStyle === "empty" && (
          <>
            <circle cx="38" cy="55" r="2" fill={slimeStyle.eyeColor} />
            <circle cx="62" cy="55" r="2" fill={slimeStyle.eyeColor} />
          </>
        )}

        {/* 입 */}
        {mouthType === "happy" && (
          <ellipse cx="50" cy="65" rx="8" ry="4" fill="#fff" />
        )}
        {mouthType === "sad" && (
          <ellipse cx="50" cy="68" rx="8" ry="4" fill="#fff" />
        )}
        {mouthType === "angry" && (
          <path d="M 42 65 L 58 65 M 42 67 L 58 67" stroke="#fff" strokeWidth="2" />
        )}
        {mouthType === "worried" && (
          <ellipse cx="50" cy="67" rx="6" ry="2" fill="#fff" />
        )}
        {mouthType === "excited" && (
          <ellipse cx="50" cy="63" rx="10" ry="6" fill="#fff" />
        )}
        {mouthType === "bored" && (
          <ellipse cx="50" cy="65" rx="6" ry="1" fill="#fff" />
        )}
        {mouthType === "empty" && (
          <ellipse cx="50" cy="65" rx="4" ry="1" fill="#fff" />
        )}
        {mouthType === "normal" && (
          <ellipse cx="50" cy="65" rx="6" ry="3" fill="#fff" />
        )}
      </>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100 flex flex-col items-center">
      <div className="font-bold text-blue-700 text-lg mb-4">나의 MoodiPet 슬라임</div>
      
      {/* 슬라임 SVG */}
      <svg width="100" height="80" viewBox="0 0 100 80">
        <ellipse 
          cx="50" 
          cy="55" 
          rx="40" 
          ry="25" 
          fill={slimeStyle.color} 
          stroke="#4FC3F7" 
          strokeWidth="2" 
        />
        {renderExpression()}
      </svg>
      
      <div className="mt-2 text-blue-700 font-semibold text-center max-w-xs">
        {ment}
      </div>
      <div className="text-sm text-gray-600 mt-2">현재 감정: <span className="font-semibold text-blue-600">{emotion}</span></div>
      <div className="text-sm text-gray-600">진화 단계: <span className="font-semibold text-green-600">{evolution}</span></div>
    </div>
  );
} 