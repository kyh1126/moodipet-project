import React from "react";

interface PetCardProps {
  emotion?: string;
  evolution?: number;
  ment?: string;
}

export default function PetCard({ emotion = "happy", evolution = 3, ment = "" }: PetCardProps) {
  // Determine slime style based on emotion
  const getSlimeStyle = (emotion: string) => {
    switch (emotion) {
      case "happy":
        return {
          color: "#FFD700", // Gold
          eyeColor: "#333",
          mouthType: "happy",
          accessories: ["crown", "sparkles"]
        };
      case "sad":
        return {
          color: "#87CEEB", // Sky blue
          eyeColor: "#333",
          mouthType: "sad",
          accessories: ["tear", "cloud"]
        };
      case "angry":
        return {
          color: "#FF6B6B", // Red
          eyeColor: "#FF0000",
          mouthType: "angry",
          accessories: ["fire", "lightning"]
        };
      case "anxious":
        return {
          color: "#FFB347", // Orange
          eyeColor: "#333",
          mouthType: "worried",
          accessories: ["question", "sweat"]
        };
      case "excited":
        return {
          color: "#98FB98", // Light green
          eyeColor: "#333",
          mouthType: "excited",
          accessories: ["star", "rainbow"]
        };
      case "bored":
        return {
          color: "#DDA0DD", // Light purple
          eyeColor: "#333",
          mouthType: "bored",
          accessories: ["zzz", "bubble"]
        };
      case "empty":
        return {
          color: "#D3D3D3", // Gray
          eyeColor: "#666",
          mouthType: "empty",
          accessories: ["void", "dots"]
        };
      default:
        return {
          color: "#B4E7FF",
          eyeColor: "#333",
          mouthType: "normal",
          accessories: []
        };
    }
  };

  const slimeStyle = getSlimeStyle(emotion);

  // Accessory rendering function
  const renderAccessories = () => {
    const { accessories } = slimeStyle;
    
        return (
          <>
        {accessories.includes("crown") && (
          <path d="M 30 40 L 50 30 L 70 40 L 65 35 L 50 25 L 35 35 Z" fill="#FFD700" />
        )}
        {accessories.includes("sparkles") && (
          <>
            <circle cx="25" cy="25" r="2" fill="#FFF" />
            <circle cx="75" cy="25" r="2" fill="#FFF" />
            <circle cx="20" cy="70" r="1.5" fill="#FFF" />
            <circle cx="80" cy="70" r="1.5" fill="#FFF" />
          </>
        )}
        {accessories.includes("tear") && (
          <ellipse cx="45" cy="70" rx="2" ry="4" fill="#87CEEB" />
        )}
        {accessories.includes("cloud") && (
          <ellipse cx="75" cy="30" rx="8" ry="5" fill="#E6F3FF" />
        )}
        {accessories.includes("fire") && (
          <path d="M 30 35 L 35 25 L 40 35 L 35 30 Z" fill="#FF4500" />
        )}
        {accessories.includes("lightning") && (
          <path d="M 70 25 L 65 35 L 70 40 L 75 35 Z" fill="#FFD700" />
        )}
        {accessories.includes("question") && (
          <text x="75" y="30" fill="#FFB347" fontSize="12">?</text>
        )}
        {accessories.includes("sweat") && (
          <ellipse cx="75" cy="25" rx="3" ry="2" fill="#FFB347" />
        )}
        {accessories.includes("star") && (
          <path d="M 50 20 L 52 25 L 57 25 L 53 28 L 55 33 L 50 30 L 45 33 L 47 28 L 43 25 L 48 25 Z" fill="#FFD700" />
        )}
        {accessories.includes("rainbow") && (
          <path d="M 20 60 Q 50 50 80 60" stroke="#FF69B4" strokeWidth="2" fill="none" />
        )}
        {accessories.includes("zzz") && (
          <>
            <text x="75" y="25" fill="#DDA0DD" fontSize="12">z</text>
            <text x="78" y="22" fill="#DDA0DD" fontSize="10">z</text>
            <text x="81" y="19" fill="#DDA0DD" fontSize="8">z</text>
          </>
        )}
        {accessories.includes("bubble") && (
          <ellipse cx="25" cy="30" rx="4" ry="3" fill="#DDA0DD" opacity="0.6" />
        )}
        {accessories.includes("void") && (
          <circle cx="50" cy="50" r="15" fill="#000" opacity="0.1" />
        )}
        {accessories.includes("dots") && (
          <>
            <circle cx="25" cy="25" r="1" fill="#666" />
            <circle cx="75" cy="25" r="1" fill="#666" />
            <circle cx="50" cy="75" r="1" fill="#666" />
          </>
        )}
          </>
        );
  };

  // Expression rendering function
  const renderExpression = () => {
    const { mouthType } = slimeStyle;
    
        return (
          <>
        {/* Eyes */}
        <circle cx="38" cy="55" r="4" fill={slimeStyle.eyeColor} />
        <circle cx="62" cy="55" r="4" fill={slimeStyle.eyeColor} />
        
        {/* Mouth */}
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
              <div className="font-bold text-blue-700 text-lg mb-4">My MoodiPet Slime Complete Form</div>
      
      {/* Slime SVG */}
      <svg width="100" height="80" viewBox="0 0 100 80">
        {/* Slime body */}
        <ellipse 
          cx="50" 
          cy="55" 
          rx="40" 
          ry="25" 
          fill={slimeStyle.color} 
          stroke="#4FC3F7" 
              strokeWidth="2"
            />
            
        {/* Accessories */}
        {renderAccessories()}
            
        {/* Expression */}
        {renderExpression()}
          </svg>
      
      <div className="mt-2 text-blue-700 font-semibold text-center max-w-xs">
        {ment}
      </div>
      <div className="text-sm text-gray-600 mt-2">Current emotion: <span className="font-semibold text-blue-600">{emotion}</span></div>
      <div className="text-sm text-gray-600">Evolution stage: <span className="font-semibold text-green-600">{evolution}</span></div>
    </div>
  );
} 