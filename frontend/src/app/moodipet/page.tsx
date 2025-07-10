"use client";

import React, { useState, useEffect } from "react";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, useReadContracts } from "wagmi";
import { parseEther } from "viem";
import EggCard from "../../components/EggCard";
import SlimeCard from "../../components/SlimeCard";
import PetCard from "../../components/PetCard";
import { readContract } from 'wagmi/actions';
import type { Abi } from 'viem';

// ABI 및 주소 import
import HealingTokenAbi from "../../lib/abi/HealingToken.json";
const MoodiPetNFTAbi = require('../../lib/abi/MoodiPetNFT.json').abi as Abi;

const HEALING_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_HEALING_TOKEN_ADDRESS as `0x${string}`;
const MOODIPET_NFT_ADDRESS = process.env.NEXT_PUBLIC_MOODIPET_NFT_ADDRESS as `0x${string}`;

const emotionMentDB: Record<string, string[]> = {
  "행복": [
    "오늘 내 행복도는 레이저 포인터 든 고양이 수준이야.",
    "행복이 넘친다면, 내 안의 피에로가 춤추기 시작해.",
    "세로토닌 과다 복용 중. 조치 바람.",
    "행복이 넘쳐서 내 안의 광대가 춤추기 시작했어.",
    "오늘은 행복이 넘쳐서 내 안의 광대가 춤을 춰.",
    "행복이 넘쳐서 내 안의 광대가 춤추기 시작했어요."
  ],
  "우울": [
    "우는 거 아님. 그냥 영혼이 새는 중임.",
    "슬픈 거 아님. 감정 로딩 중이야.",
    "슬프면 나랑 같이 비 오는 멜로디 속으로 풍덩 빠져보자.",
    "우는 게 아니라 영혼이 조금씩 새고 있어.",
    "슬픈 건 아니고 그냥 감정이 버퍼링 중이야.",
    "슬프면 나랑 같이 비 오는 멜로디에 빠져보자."
  ],
  "분노": [
    "말 걸지 마. 머릿속에서 싸우느라 바빠.",
    "귀엽긴 한데 화남. 접근 주의.",
    "화가 치밀면 내 안의 베토벤이 교향곡을 연주해.",
    "말 걸지 마. 머릿속에서 모든 사람과 싸우느라 바빠.",
    "화나긴 했는데 귀여워. 조심해서 접근해.",
    "화가 치밀면 내 안의 베토벤이 교향곡을 연주해요."
  ],
  "불안": [
    "불안이 밀려온다면, 스릴을 끝까지 즐겨보자.",
    "불안하면 심장소리를 폰 벨소리로 써볼까?",
    "내 불안과 간식 보관함이 누가 더 숨겼나 경쟁 중이야.",
    "불안이 밀려오면 차라리 스릴을 즐겨보자.",
    "불안할 때는 심장소리를 벨소리로 설정해볼까?",
    "내 불안과 간식 보관함이 경쟁 중이에요."
  ],
  "설렘": [
    "누가 새 모험이라고 했어? 나 벌써 짐 다 쌌어.",
    "나비요? 배 속에 동물원 열렸음.",
    "몸 안에서 글리터가 펑! 하고 터진 기분.",
    "새로운 모험이라고? 나 벌써 짐을 다 쌌어.",
    "나비가 아니라 배 속에 동물원이 열렸어.",
    "몸 안에서 글리터가 펑! 하고 터진 기분이에요."
  ],
  "지루함": [
    "지루한 거 참느니, 눈썹에 눈 그리자.",
    "심심해? 머릿속 고양이랑 숨바꼭질 어때?",
    "지루함이 폰 배터리보다 높음.",
    "지루한 거 참느니 눈썹에 눈을 그려보자.",
    "심심하면 머릿속 고양이랑 숨바꼭질 해볼까?",
    "지루함이 폰 배터리보다 높아요."
  ],
  "허무": [
    "조금씩 인간 구실 하는 중이에요.",
    "오늘 기분? 존재론적 부리또.",
    "감정적으로? 커피 얼룩 묻은 빈 종이 같아.",
    "천천히 인간 구실을 하는 중이에요.",
    "현재 기분은 존재론적 부리또 상태.",
    "감정적으로는 커피 얼룩 묻은 빈 종이 같아요."
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
  // 지갑 연결 정보
  const { address, isConnected } = useAccount();
  const [emotion, setEmotion] = useState("행복");
  const [ment, setMent] = useState(emotionMentDB[emotion][0]);

  // 감정별 성격 매핑
  const getPersonalityByEmotion = (emotion: string) => {
    const personalityMap: Record<string, string> = {
      "행복": "활발한",
      "우울": "조용한", 
      "분노": "화난",
      "불안": "긴장한",
      "설렘": "에너지 넘치는",
      "지루함": "나른한",
      "허무": "무기력한"
    };
    return personalityMap[emotion] || "평범한";
  };

  // 감정 변경 시 랜덤 멘트 선택
  useEffect(() => {
    const mentList = emotionMentDB[emotion] || [];
    const randomIndex = Math.floor(Math.random() * mentList.length);
    setMent(mentList[randomIndex]);
  }, [emotion]);

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
  // 민팅 조건 완화: 토큰 잔액 1개 이상이면 민팅 가능
  const canMint = Number(tokenBalance) >= 1;

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
      <h1 className="text-3xl font-extrabold text-blue-700 mb-2">MoodiPet 감정 슬라임 대시보드</h1>
      <p className="text-lg text-gray-700 mb-6">오늘의 감정을 기록하고, 나만의 슬라임을 성장시키세요!</p>
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
            <option>행복</option>
            <option>우울</option>
            <option>분노</option>
            <option>불안</option>
            <option>설렘</option>
            <option>지루함</option>
            <option>허무</option>
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
          <SlimeCard emotion={emotion} evolution={evolution} ment={ment} />
        )}
        {showPet && (
          <PetCard emotion={emotion} evolution={evolution} ment={ment} />
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
                args: [address, "", emotion, "", evolution, getPersonalityByEmotion(emotion)],
              });
            }
          }}
        >
          MoodiPet 슬라임 NFT 민팅하기
        </button>

        {/* 내 NFT 목록 표시 */}
        <div className="mt-10 w-full">
          <h2 className="text-xl font-bold text-blue-700 mb-2">내 MoodiPet 슬라임 NFT</h2>
          {myPets.length === 0 ? (
            <div className="text-gray-500">아직 민팅한 MoodiPet 슬라임 NFT가 없습니다.</div>
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
                      alt="MoodiPet 슬라임 NFT"
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