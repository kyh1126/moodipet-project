import EmotionForm from "../../components/EmotionForm";
import TokenBalance from "../../components/TokenBalance";
import PetCard from "../../components/PetCard";
import EggCard from "../../components/EggCard";
import MintButton from "../../components/MintButton";

export default function MoodiPetPage() {
  // 임시 데이터 - 실제로는 스마트 컨트랙트에서 가져올 데이터
  const petData = {
    emotion: "기쁨",
    evolution: 1, // 1: 알 상태, 2+: 펫 상태
    personality: "고양이",
    createdAt: "2024-06-01",
    isHatching: false
  };

  // 진화 단계에 따라 알 또는 펫 표시
  const showEgg = petData.evolution === 1;
  const showPet = petData.evolution >= 2;

  return (
    <section className="flex flex-col gap-8 py-12 items-center bg-gradient-to-b from-blue-50 to-white min-h-screen">
      <h1 className="text-3xl font-extrabold text-blue-700 mb-2">MoodiPet 감정 펫 대시보드</h1>
      <p className="text-lg text-gray-700 mb-6">오늘의 감정을 기록하고, 나만의 펫을 성장시키세요!</p>
      
      <div className="w-full max-w-md flex flex-col gap-6">
        <EmotionForm />
        <TokenBalance />
        
        {/* 알/펫 상태에 따른 컴포넌트 분기 */}
        {showEgg && (
          <EggCard 
            emotion={petData.emotion}
            evolution={petData.evolution}
            isHatching={petData.isHatching}
          />
        )}
        
        {showPet && (
          <PetCard 
            emotion={petData.emotion}
            evolution={petData.evolution}
            personality={petData.personality}
            createdAt={petData.createdAt}
          />
        )}
        
        <MintButton />
      </div>
    </section>
  );
} 