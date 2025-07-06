import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center py-4 px-6 border-b bg-white/80 backdrop-blur-md sticky top-0 z-10">
      <div className="font-bold text-xl text-blue-600">MoodiPet</div>
      <div>
        <ConnectButton />
      </div>
    </nav>
  );
} 