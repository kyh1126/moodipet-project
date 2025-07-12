import React from "react";

interface EggCardProps {
  emotion?: string;
  evolution?: number;
  isHatching?: boolean;
}

export default function EggCard({ emotion = "happy", evolution = 1, isHatching = false }: EggCardProps) {
  // Determine egg color based on emotion
  const getEggColor = (emotion: string) => {
    switch (emotion) {
      case "happy":
        return "#FFE5B4"; // Light yellow
      case "sad":
        return "#E6F3FF"; // Light blue
      case "angry":
        return "#FFE6E6"; // Light red
      case "anxious":
        return "#FFF2E6"; // Light orange
      case "excited":
        return "#E6FFE6"; // Light green
      case "bored":
        return "#F0E6FF"; // Light purple
      case "empty":
        return "#F5F5F5"; // Light gray
      default:
        return "#FFE5B4";
    }
  };

  const eggColor = getEggColor(emotion);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100">
      <div className="font-bold text-blue-700 text-lg mb-4">My MoodiPet Egg</div>
      
      {/* Egg illustration */}
      <div className="flex justify-center mb-4">
        <div className="relative">
          <svg width="120" height="160" viewBox="0 0 120 160">
            {/* Egg body */}
            <ellipse
              cx="60"
              cy="80"
              rx="50"
              ry="70"
              fill={eggColor}
              stroke="#D4A574"
              strokeWidth="2"
            />
            
            {/* Egg surface pattern */}
            <ellipse
              cx="60"
              cy="70"
              rx="25"
              ry="15"
              fill="rgba(255,255,255,0.3)"
            />
            
            {/* Egg center sparkle effect */}
            <circle
              cx="55"
              cy="65"
              r="3"
              fill="rgba(255,255,255,0.6)"
            />
            
            {/* Cracking effect when hatching */}
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
      
      {/* Egg information */}
      <div className="text-center space-y-2">
        <div className="text-sm text-gray-600">Current emotion: <span className="font-semibold text-blue-600">{emotion}</span></div>
        <div className="text-sm text-gray-600">Evolution stage: <span className="font-semibold text-green-600">{evolution}</span></div>
        {isHatching && (
          <div className="text-sm text-orange-600 font-semibold animate-pulse">
            🐣 Hatching...
          </div>
        )}
      </div>
      
      {/* Egg status guide */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-700">
          Record your emotions to help the egg grow, and it will hatch into a slime after sufficient emotion records!
        </p>
      </div>
    </div>
  );
} 