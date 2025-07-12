import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8 bg-white">
      <h1 className="text-3xl font-extrabold text-blue-700">MoodiPet Emotion Pet Dashboard</h1>
      <p className="text-lg text-gray-700">Click the button below to use emotion recording, pet minting, and pet management features.</p>
      <Link href="/moodipet">
        <button className="bg-blue-500 text-white px-8 py-4 rounded-xl font-bold text-lg shadow hover:bg-blue-600 transition">Start MoodiPet</button>
      </Link>
    </div>
  );
}
