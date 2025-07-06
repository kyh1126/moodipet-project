"use client";

import React, { useState, useEffect } from "react";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, useReadContracts } from "wagmi";
import { parseEther } from "viem";
import EggCard from "../../components/EggCard";
import { readContract } from 'wagmi/actions';
import type { Abi } from 'viem';

// ABI 및 주소 import
import HealingTokenAbi from "../../lib/abi/HealingToken.json";
const MoodiPetNFTAbi = require('../../lib/abi/MoodiPetNFT.json').abi as Abi;

const HEALING_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_HEALING_TOKEN_ADDRESS as `0x${string}`;
const MOODIPET_NFT_ADDRESS = process.env.NEXT_PUBLIC_MOODIPET_NFT_ADDRESS as `0x${string}`;

const emotionMentDB: Record<string, string[]> = {
  "기쁨": ["오늘은 기분 최고야!", "햇살처럼 빛나는 하루!"],
  "슬픔": ["마라탕 먹자...", "조금 울적해..."],
  "화남": ["으으, 화가 나!", "분노의 슬라임!"],
  "평온": ["마음이 잔잔해~", "고요한 하루"],
  "우울": ["조금 힘들어도 괜찮아.", "구름 낀 기분이야"],
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
  // 지갑 연결 정보
  const { address, isConnected } = useAccount();
  const [emotion, setEmotion] = useState("기쁨");
  const [ment, setMent] = useState(emotionMentDB[emotion][0]);

  // HealingToken 컨트랙트에서 토큰 잔액, 연속 기록, 진화 단계 fetch
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

  // 진화 단계: 연속 기록일/3 (최대 3)
  const evolution = consecutiveDays ? Math.min(3, Math.floor(Number(consecutiveDays) / 3) + 1) : 1;

  // 감정 기록 트랜잭션 실행
  const { writeContract: recordMood, data: recordTx } = useWriteContract();
  useWaitForTransactionReceipt({
    hash: recordTx,
  });

  // 민팅 트랜잭션 실행
  const { writeContract: mintPet, data: mintTx } = useWriteContract();
  useWaitForTransactionReceipt({
    hash: mintTx,
  });

  // 진화 단계별 카드
  const showEgg = evolution === 1;
  const showSlime = evolution === 2;
  const showPet = evolution === 3;
  const canMint = Number(tokenBalance) >= 10 && evolution === 3;

  // 내 NFT 토큰ID 목록 조회
  const { data: myTokenIds } = useReadContract({
    address: MOODIPET_NFT_ADDRESS,
    abi: MoodiPetNFTAbi,
    functionName: "getUserPets",
    args: address ? [address] : undefined,
  });
  const myPets = (myTokenIds as bigint[] | undefined)?.slice(0, 5) || [];

  // 여러 NFT 속성 한 번에 읽기
  const { data: petAttributesList } = useReadContracts({
    contracts: myPets.map(tokenId => ({
      address: MOODIPET_NFT_ADDRESS,
      abi: MoodiPetNFTAbi,
      functionName: "getPetAttributes",
      args: [tokenId],
    })),
  });

  // 여러 NFT 메타데이터(tokenURI) 한 번에 읽기
  const { data: tokenUriList } = useReadContracts({
    contracts: myPets.map(tokenId => ({
      address: MOODIPET_NFT_ADDRESS,
      abi: MoodiPetNFTAbi,
      functionName: "tokenURI",
      args: [tokenId],
    })),
  });

  // tokenUriList에서 result만 추출
  const uris = tokenUriList?.map(x => x?.result as string);

  // 각 tokenURI에서 메타데이터 fetch
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
      <h1 className="text-3xl font-extrabold text-blue-700 mb-2">MoodiPet 감정 펫 대시보드</h1>
      <p className="text-lg text-gray-700 mb-6">오늘의 감정을 기록하고, 나만의 펫을 성장시키세요!</p>
      <div className="w-full max-w-md flex flex-col gap-6">
        {/* 감정 기록 폼 */}
        <form
          className="flex flex-col gap-4 bg-white rounded-2xl shadow-lg p-8 border border-blue-100"
          onSubmit={e => {
            e.preventDefault();
            if (!isConnected) return alert("지갑을 연결해 주세요!");
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
          <label className="font-bold text-blue-700 text-lg mb-2">오늘의 감정을 선택하세요</label>
          <select
            name="emotion"
            className="border-2 border-blue-200 rounded-lg px-4 py-3 text-lg focus:outline-blue-400"
            value={emotion}
            onChange={e => setEmotion(e.target.value)}
          >
            <option>기쁨</option>
            <option>슬픔</option>
            <option>화남</option>
            <option>평온</option>
            <option>우울</option>
          </select>
          <button type="submit" className="bg-blue-500 text-white rounded-xl px-6 py-3 mt-4 text-lg font-bold shadow hover:bg-blue-600 transition">감정 기록하기</button>
        </form>

        {/* 토큰 잔액 */}
        <div className="bg-blue-50 rounded-lg p-4 text-blue-700 font-bold text-center">
          내 Healing Token 잔액: {Number(tokenBalance) || 0} HEAL
        </div>

        {/* 진화 단계별 카드 */}
        {showEgg && (
          <EggCard emotion={emotion} evolution={evolution} />
        )}
        {showSlime && (
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100 flex flex-col items-center">
            <div className="font-bold text-blue-700 text-lg mb-4">나의 MoodiPet 슬라임</div>
            {/* 슬라임 SVG */}
            <svg width="100" height="80" viewBox="0 0 100 80">
              <ellipse cx="50" cy="55" rx="40" ry="25" fill="#B4E7FF" stroke="#4FC3F7" strokeWidth="2" />
              {/* 표정(눈/입) */}
              <circle cx="38" cy="55" r="4" fill="#333" />
              <circle cx="62" cy="55" r="4" fill="#333" />
              <ellipse cx="50" cy="65" rx="10" ry="4" fill="#fff" />
            </svg>
            <div className="mt-2 text-blue-700 font-semibold">{ment}</div>
            <div className="text-sm text-gray-600 mt-2">현재 감정: <span className="font-semibold text-blue-600">{emotion}</span></div>
            <div className="text-sm text-gray-600">진화 단계: <span className="font-semibold text-green-600">{evolution}</span></div>
          </div>
        )}
        {showPet && (
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100 flex flex-col items-center">
            <div className="font-bold text-blue-700 text-lg mb-4">나의 MoodiPet</div>
            {/* 펫 SVG */}
            <svg width="100" height="80" viewBox="0 0 100 80">
              <ellipse cx="50" cy="55" rx="40" ry="25" fill="#B4E7FF" stroke="#4FC3F7" strokeWidth="2" />
              {/* 표정(눈/입) */}
              <circle cx="38" cy="55" r="4" fill="#333" />
              <circle cx="62" cy="55" r="4" fill="#333" />
              <ellipse cx="50" cy="65" rx="10" ry="4" fill="#fff" />
            </svg>
            <div className="mt-2 text-blue-700 font-semibold">{emotion}</div>
            <div className="text-sm text-gray-600">진화 단계: <span className="font-semibold text-green-600">{evolution}</span></div>
          </div>
        )}

        {/* 민팅 버튼 */}
        <button
          className={`w-full rounded px-4 py-3 font-bold mt-4 shadow transition text-white text-lg ${canMint ? "bg-green-500 hover:bg-green-600" : "bg-gray-300 cursor-not-allowed"}`}
          disabled={!canMint || !mintPet}
          onClick={() => {
            if (!isConnected) return alert("지갑을 연결해 주세요!");
            if (mintPet && address) {
              mintPet({
                address: MOODIPET_NFT_ADDRESS,
                abi: MoodiPetNFTAbi,
                functionName: "mintMoodiPet",
                args: [address, "", emotion, "", evolution, "고양이"],
              });
            }
          }}
        >
          MoodiPet NFT 민팅하기
        </button>

        {/* 내 NFT 목록 표시 */}
        <div className="mt-10 w-full">
          <h2 className="text-xl font-bold text-blue-700 mb-2">내 MoodiPet NFT</h2>
          {myPets.length === 0 ? (
            <div className="text-gray-500">아직 민팅한 MoodiPet NFT가 없습니다.</div>
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
                        alt="MoodiPet NFT"
                        className="w-32 h-32 object-contain rounded-full border-4 border-blue-300 shadow mb-2"
                        style={{ background: "#f0f6ff" }}
                      />
                    ) : (
                      <div className="w-32 h-32 flex items-center justify-center bg-blue-50 rounded-full mb-2 text-gray-400">이미지 없음</div>
                    )}
                    {/* 기타 속성 표시 */}
                    {petAttr ? (
                      <div className="text-sm text-gray-700 mt-1 text-center">
                        감정: {petAttr.emotion} <br />
                        색상: {petAttr.color} <br />
                        진화 단계: {petAttr.evolution?.toString()} <br />
                        성격: {petAttr.personality} <br />
                        생성일: {petAttr.createdAt?.toString()}
                      </div>
                    ) : (
                      <div className="text-gray-400">속성 불러오는 중...</div>
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