import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8 bg-white">
      <h1 className="text-3xl font-extrabold text-blue-700">MoodiPet 감정 펫 대시보드</h1>
      <p className="text-lg text-gray-700">감정 기록, 펫 민팅, 펫 관리 기능을 사용하려면 아래 버튼을 클릭하세요.</p>
      <Link href="/moodipet">
        <button className="bg-blue-500 text-white px-8 py-4 rounded-xl font-bold text-lg shadow hover:bg-blue-600 transition">MoodiPet 시작하기</button>
      </Link>
    </div>
  );
}
