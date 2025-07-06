import React from "react";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center py-4 px-6 border-b bg-white/80 backdrop-blur-md sticky top-0 z-10">
      <div className="font-bold text-xl text-blue-600">MoodiPet</div>
      <div>
        {/* 지갑 연결 버튼 자리 */}
        <button className="rounded bg-blue-500 text-white px-4 py-2 shadow">지갑 연결</button>
      </div>
    </nav>
  );
} 