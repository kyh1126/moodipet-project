"use client";

import React, { useState, useEffect } from "react";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, useReadContracts } from "wagmi";
import { parseEther } from "viem";
import EggCard from "../../components/EggCard";
import SlimeCard from "../../components/SlimeCard";
import PetCard from "../../components/PetCard";
import { readContract } from 'wagmi/actions';
import type { Abi } from 'viem';

// ABI and address import
import HealingTokenAbi from "../../lib/abi/HealingToken.json";
const MoodiPetNFTAbi = require('../../lib/abi/MoodiPetNFT.json').abi as Abi;

const HEALING_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_HEALING_TOKEN_ADDRESS as `0x${string}`;
const MOODIPET_NFT_ADDRESS = process.env.NEXT_PUBLIC_MOODIPET_NFT_ADDRESS as `0x${string}`;

const emotionMentDB: Record<string, string[]> = {
  "Happy": [
    "My happiness level today is like a cat with a laser pointer.",
    "If happiness overflows, the clown inside me starts dancing.",
    "Serotonin overdose in progress. Action required.",
    "Happiness is overflowing, the clown inside me started dancing.",
    "Today I'm so happy the clown inside me is dancing.",
    "Happiness is overflowing, the clown inside me started dancing."
  ],
  "Sad": [
    "Not crying. Just soul leaking.",
    "Not sad. Just emotion loading.",
    "If you're sad, let's dive into rainy melodies together.",
    "Not crying, just soul slowly leaking.",
    "Not sad, just emotion buffering.",
    "If you're sad, let's get lost in rainy melodies."
  ],
  "Angry": [
    "Don't talk to me. Busy fighting in my head.",
    "Cute but angry. Approach with caution.",
    "When anger surges, Beethoven inside me plays a symphony.",
    "Don't talk to me. Busy fighting everyone in my head.",
    "Angry but cute. Approach carefully.",
    "When anger surges, Beethoven inside me plays a symphony."
  ],
  "Anxious": [
    "If anxiety comes, let's enjoy the thrill to the end.",
    "When anxious, should we use heartbeat as phone ringtone?",
    "My anxiety and snack storage are competing to see who's more hidden.",
    "If anxiety comes, let's enjoy the thrill instead.",
    "When anxious, should we set heartbeat as ringtone?",
    "My anxiety and snack storage are competing."
  ],
  "Excited": [
    "Who said new adventure? I already packed everything.",
    "Butterflies? Zoo opened in my stomach.",
    "Feeling like glitter exploded inside my body.",
    "New adventure? I already packed everything.",
    "Not butterflies, zoo opened in my stomach.",
    "Feeling like glitter exploded inside my body."
  ],
  "Bored": [
    "Rather than endure boredom, let's draw snow on eyebrows.",
    "Bored? How about hide and seek with the cat in my head?",
    "Boredom higher than phone battery.",
    "Rather than endure boredom, let's draw snow on eyebrows.",
    "If bored, how about hide and seek with the cat in my head?",
    "Boredom higher than phone battery."
  ],
  "Empty": [
    "Slowly being human.",
    "Today's mood? Existential burrito.",
    "Emotionally? Like empty paper with coffee stains.",
    "Slowly being human.",
    "Current mood: existential burrito state.",
    "Emotionally like empty paper with coffee stains."
  ]
};

// NFT 이미지 및 메타데이터 fetch hook
function useNftMetadata(tokenId: bigint | undefined) {
  const { data: tokenUri } = useReadContract({
    address: MOODIPET_NFT_ADDRESS,
    abi: MoodiPetNFTAbi,
    functionName: "tokenURI",
    args: tokenId ? [tokenId] : undefined,
  });
  const [metadata, setMetadata] = useState<any>(null);

  useEffect(() => {
    if (tokenUri && typeof tokenUri === "string") {
      fetch(tokenUri)
        .then(res => res.json())
        .then(setMetadata)
        .catch(() => setMetadata(null));
    }
  }, [tokenUri]);

  return metadata;
}

// 여러 NFT 속성 비동기 fetch 커스텀 훅
function useMultiPetAttributes(tokenIds: bigint[] | undefined) {
  const [attributes, setAttributes] = useState<any[]>([]);
  useEffect(() => {
    if (!tokenIds || tokenIds.length === 0) {
      setAttributes([]);
      return;
    }
    let cancelled = false;
    Promise.all(
      tokenIds.map(tokenId =>
        readContract({
          address: MOODIPET_NFT_ADDRESS,
          abi: MoodiPetNFTAbi,
          functionName: "getPetAttributes",
          args: [tokenId],
        }).catch(() => null)
      )
    ).then(results => {
      if (!cancelled) setAttributes(results);
    });
    return () => { cancelled = true; };
  }, [tokenIds]);
  return attributes;
}

// 여러 NFT 메타데이터 비동기 fetch 커스텀 훅
function useMultiNftMetadata(tokenIds: bigint[] | undefined) {
  const [metadatas, setMetadatas] = useState<any[]>([]);
  useEffect(() => {
    if (!tokenIds || tokenIds.length === 0) {
      setMetadatas([]);
      return;
    }
    let cancelled = false;
    Promise.all(
      tokenIds.map(async tokenId => {
        try {
          const tokenUri = await readContract({
            address: MOODIPET_NFT_ADDRESS,
            abi: MoodiPetNFTAbi,
            functionName: "tokenURI",
            args: [tokenId],
          });
          if (typeof tokenUri === "string") {
            const res = await fetch(tokenUri);
            return await res.json();
          }
        } catch {
          return null;
        }
      })
    ).then(results => {
      if (!cancelled) setMetadatas(results);
    });
    return () => { cancelled = true; };
  }, [tokenIds]);
  return metadatas;
}

export default function MoodiPetPage() {
  // Wallet connection info
  const { address, isConnected } = useAccount();
  const [emotion, setEmotion] = useState("Happy");
  const [ment, setMent] = useState(emotionMentDB[emotion][0]);

  // Personality mapping by emotion
  const getPersonalityByEmotion = (emotion: string) => {
    const personalityMap: Record<string, string> = {
      "Happy": "Energetic",
      "Sad": "Quiet", 
      "Angry": "Angry",
      "Anxious": "Nervous",
      "Excited": "Energetic",
      "Bored": "Lazy",
      "Empty": "Lethargic"
    };
    return personalityMap[emotion] || "Normal";
  };

  // Select random message when emotion changes
  useEffect(() => {
    const mentList = emotionMentDB[emotion] || [];
    const randomIndex = Math.floor(Math.random() * mentList.length);
    setMent(mentList[randomIndex]);
  }, [emotion]);

  // Fetch token balance, consecutive records, evolution stage from HealingToken contract
  const { data: tokenBalance, refetch: refetchToken } = useReadContract({
    address: HEALING_TOKEN_ADDRESS,
    abi: HealingTokenAbi.abi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
  });
  const { data: consecutiveDays, refetch: refetchDays } = useReadContract({
    address: HEALING_TOKEN_ADDRESS,
    abi: HealingTokenAbi.abi,
    functionName: "getConsecutiveDays",
    args: address ? [address] : undefined,
  });

  useEffect(() => {
    console.log("consecutiveDays:", consecutiveDays);
  }, [consecutiveDays]);

  // Evolution stage: consecutive days/3 (max 3)
  const evolution = consecutiveDays ? Math.min(3, Math.floor(Number(consecutiveDays) / 3) + 1) : 1;

  // Execute emotion recording transaction
  const { writeContract: recordMood, data: recordTx } = useWriteContract();
  useWaitForTransactionReceipt({
    hash: recordTx,
  });

  // Execute minting transaction
  const { writeContract: mintPet, data: mintTx } = useWriteContract();
  useWaitForTransactionReceipt({
    hash: mintTx,
  });

  // Cards by evolution stage
  const showEgg = evolution === 1;
  const showSlime = evolution === 2;
  const showPet = evolution === 3;
  // Relaxed minting condition: can mint if token balance is 1 or more
  const canMint = Number(tokenBalance) >= 1;

  // Get my NFT token ID list
  const { data: myTokenIds } = useReadContract({
    address: MOODIPET_NFT_ADDRESS,
    abi: MoodiPetNFTAbi,
    functionName: "getUserPets",
    args: address ? [address] : undefined,
  });
  const myPets = (myTokenIds as bigint[] | undefined)?.slice(0, 5) || [];

  // Read multiple NFT attributes at once
  const { data: petAttributesList } = useReadContracts({
    contracts: myPets.map(tokenId => ({
      address: MOODIPET_NFT_ADDRESS,
      abi: MoodiPetNFTAbi,
      functionName: "getPetAttributes",
      args: [tokenId],
    })),
  });

  // Read multiple NFT metadata (tokenURI) at once
  const { data: tokenUriList } = useReadContracts({
    contracts: myPets.map(tokenId => ({
      address: MOODIPET_NFT_ADDRESS,
      abi: MoodiPetNFTAbi,
      functionName: "tokenURI",
      args: [tokenId],
    })),
  });

  // Extract only result from tokenUriList
  const uris = tokenUriList?.map(x => x?.result as string);

  // Fetch metadata from each tokenURI
  const [metadataList, setMetadataList] = useState<any[]>([]);
  useEffect(() => {
    if (!uris) return;
    let cancelled = false;
    Promise.all(
      uris.map(async (uri) => {
        try {
          if (typeof uri === "string") {
            const res = await fetch(uri);
            return await res.json();
          }
        } catch {
          return null;
        }
      })
    ).then(results => {
      if (!cancelled) setMetadataList(results);
    });
    return () => { cancelled = true; };
  }, [uris]);

  return (
    <section className="flex flex-col gap-8 py-12 items-center bg-gradient-to-b from-blue-50 to-white min-h-screen">
              <h1 className="text-3xl font-extrabold text-blue-700 mb-2">MoodiPet Emotional Slime Dashboard</h1>
      <p className="text-lg text-gray-700 mb-6">Record your emotions today and grow your own slime!</p>
      <div className="w-full max-w-md flex flex-col gap-6">
        {/* Emotion recording form */}
        <form
          className="flex flex-col gap-4 bg-white rounded-2xl shadow-lg p-8 border border-blue-100"
          onSubmit={e => {
            e.preventDefault();
            if (!isConnected) return alert("Please connect your wallet!");
            if (recordMood && address) {
              recordMood({
                address: HEALING_TOKEN_ADDRESS,
                abi: HealingTokenAbi.abi,
                functionName: "recordMood",
                args: [address, emotion],
              });
            }
          }}
        >
          <label className="font-bold text-blue-700 text-lg mb-2">Select your emotion for today</label>
          <select
            name="emotion"
            className="border-2 border-blue-200 rounded-lg px-4 py-3 text-lg focus:outline-blue-400"
            value={emotion}
            onChange={e => setEmotion(e.target.value)}
          >
            <option>Happy</option>
            <option>Sad</option>
            <option>Angry</option>
            <option>Anxious</option>
            <option>Excited</option>
            <option>Bored</option>
            <option>Empty</option>
          </select>
          <button type="submit" className="bg-blue-500 text-white rounded-xl px-6 py-3 mt-4 text-lg font-bold shadow hover:bg-blue-600 transition">Record Emotion</button>
        </form>

        {/* Token balance */}
        <div className="bg-blue-50 rounded-lg p-4 text-blue-700 font-bold text-center">
          My Healing Token Balance: {Number(tokenBalance) || 0} HEAL
        </div>

        {/* Cards by evolution stage */}
        {showEgg && (
          <EggCard emotion={emotion} evolution={evolution} />
        )}
        {showSlime && (
          <SlimeCard emotion={emotion} evolution={evolution} ment={ment} />
        )}
        {showPet && (
          <PetCard emotion={emotion} evolution={evolution} ment={ment} />
        )}

        {/* Minting button */}
        <button
          className={`w-full rounded px-4 py-3 font-bold mt-4 shadow transition text-white text-lg ${canMint ? "bg-green-500 hover:bg-green-600" : "bg-gray-300 cursor-not-allowed"}`}
          disabled={!canMint || !mintPet}
          onClick={() => {
            if (!isConnected) return alert("Please connect your wallet!");
            if (mintPet && address) {
              mintPet({
                address: MOODIPET_NFT_ADDRESS,
                abi: MoodiPetNFTAbi,
                functionName: "mintMoodiPet",
                args: [address, "", emotion, "", evolution, getPersonalityByEmotion(emotion)],
              });
            }
          }}
        >
          Mint MoodiPet Slime NFT
        </button>

        {/* My NFT list display */}
        <div className="mt-10 w-full">
          <h2 className="text-xl font-bold text-blue-700 mb-2">My MoodiPet Slime NFT</h2>
          {myPets.length === 0 ? (
            <div className="text-gray-500">No MoodiPet Slime NFT has been minted yet.</div>
          ) : (
            <div className="flex flex-col gap-4">
              {myPets.map((tokenId, idx) => {
                const petAttr = petAttributesList?.[idx]?.result;
                const metadata = metadataList[idx];
                return (
                  <div key={tokenId.toString()} className="bg-white rounded-2xl shadow p-6 border-2 border-blue-200 flex flex-col items-center">
                    <div className="font-semibold text-blue-600 mb-2">Token ID: {tokenId.toString()}</div>
                    {metadata?.image ? (
                      <img
                        src={metadata.image}
                      alt="MoodiPet Slime NFT"
                        className="w-32 h-32 object-contain rounded-full border-4 border-blue-300 shadow mb-2"
                        style={{ background: "#f0f6ff" }}
                      />
                    ) : (
                      <div className="w-32 h-32 flex items-center justify-center bg-blue-50 rounded-full mb-2 text-gray-400">No Image</div>
                    )}
                                          {/* Other attributes display */}
                    {petAttr ? (
                      <div className="text-sm text-gray-700 mt-1 text-center">
                        Emotion: {petAttr.emotion} <br />
                        Color: {petAttr.color} <br />
                        Evolution Stage: {petAttr.evolution?.toString()} <br />
                        Personality: {petAttr.personality} <br />
                        Created: {petAttr.createdAt?.toString()}
                      </div>
                    ) : (
                                              <div className="text-gray-400">Loading attributes...</div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
} 