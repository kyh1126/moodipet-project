# MoodiPet Frontend

MoodiPet의 프론트엔드 애플리케이션입니다. 사용자가 감정을 기록하고, Healing Token을 받아 MoodiPet NFT를 민팅할 수 있는 웹 인터페이스를 제공합니다.

## 🚀 빠른 시작

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
# WalletConnect 프로젝트 ID (https://cloud.walletconnect.com/에서 생성 필요)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=589acbf6c92b262cc0031cf952e4692a

# 로컬 Hardhat 네트워크 설정
NEXT_PUBLIC_CHAIN_ID=31337
NEXT_PUBLIC_RPC_URL=http://127.0.0.1:8545

# 스마트 컨트랙트 주소 (로컬 배포 후 업데이트 필요)
NEXT_PUBLIC_MOODIPET_NFT_ADDRESS=0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
NEXT_PUBLIC_HEALING_TOKEN_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3

# 네트워크 설정
NEXT_PUBLIC_NETWORK_NAME=localhost
```

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:3000`으로 접속하세요.

## 🛠️ 개발 환경 설정

### 필수 요구사항

- Node.js (v18 이상)
- npm 또는 yarn
- MetaMask 또는 다른 Web3 지갑
- 로컬 Hardhat 노드 실행 중

### 설치된 패키지

- **Next.js**: React 프레임워크
- **TypeScript**: 타입 안전성
- **Tailwind CSS**: 스타일링
- **Wagmi**: React Hooks for Ethereum
- **Viem**: TypeScript 인터페이스 for Ethereum
- **RainbowKit**: 지갑 연결 UI

## 📱 주요 기능

### 1. 지갑 연결
- WalletConnect를 통한 다양한 지갑 지원
- MetaMask, Rainbow, Coinbase Wallet 등
- 네트워크 자동 감지 및 전환

### 2. 감정 기록
- 일일 감정 상태 기록
- Healing Token 자동 지급
- 연속 기록 추적
- 7일 연속 기록 시 보너스 토큰

### 3. MoodiPet NFT 민팅
- 감정 기반 펫 NFT 생성
- 펫 속성: 감정, 색상, 진화 단계, 성격
- IPFS 메타데이터 저장
- 지갑에 NFT 저장

### 4. 펫 관리
- 사용자별 펫 목록 조회
- 펫 진화 기능
- 펫 속성 상세 보기
- 펫 이력 관리

### 5. 사용자 대시보드
- 활동 통계
- 토큰 잔액
- 연속 기록 일수
- 총 기록 수

## 🎨 UI/UX 특징

### 디자인 시스템
- **색상 팔레트**: 감정별 색상 매핑
- **애니메이션**: 부드러운 전환 효과
- **반응형**: 모바일/데스크톱 최적화
- **접근성**: WCAG 가이드라인 준수

### 사용자 경험
- **직관적 인터페이스**: 쉬운 네비게이션
- **실시간 피드백**: 트랜잭션 상태 표시
- **오류 처리**: 명확한 오류 메시지
- **로딩 상태**: 사용자 친화적 로딩 UI

## 🔧 개발 명령어

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start

# 린트 검사
npm run lint

# 타입 체크
npm run type-check
```

## 📁 프로젝트 구조

```
frontend/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── layout.tsx    # 루트 레이아웃
│   │   ├── page.tsx      # 메인 페이지
│   │   └── moodipet/     # MoodiPet 페이지
│   ├── components/       # 재사용 가능한 컴포넌트
│   │   ├── ui/          # 기본 UI 컴포넌트
│   │   ├── wallet/      # 지갑 관련 컴포넌트
│   │   └── moodipet/    # MoodiPet 관련 컴포넌트
│   ├── hooks/           # 커스텀 React Hooks
│   ├── lib/             # 유틸리티 함수
│   └── types/           # TypeScript 타입 정의
├── public/              # 정적 파일
├── .env.local          # 환경 변수
└── package.json        # 의존성 관리
```

## 🔗 스마트 컨트랙트 연동

### 컨트랙트 주소

- **MoodiPetNFT**: `0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512`
- **HealingToken**: `0x5FbDB2315678afecb367f032d93F642f64180aa3`

### 주요 함수

#### HealingToken
- `recordMood(address user, string emotion)`: 감정 기록
- `getUserMoodRecord(address user)`: 사용자 기록 조회
- `getConsecutiveDays(address user)`: 연속 일수 조회
- `hasCompletedWeek(address user)`: 주간 달성 여부

#### MoodiPetNFT
- `mintMoodiPet(address to, string uri, string emotion, string color, uint8 evolution, string personality)`: NFT 민팅
- `getPetAttributes(uint256 tokenId)`: 펫 속성 조회
- `getUserPets(address user)`: 사용자 펫 목록
- `evolvePet(uint256 tokenId, uint8 newEvolution)`: 펫 진화

## 🌐 네트워크 설정

### 로컬 개발
- **Chain ID**: 31337
- **RPC URL**: http://127.0.0.1:8545
- **네트워크**: localhost

### Base Sepolia 테스트넷
- **Chain ID**: 84532
- **RPC URL**: https://sepolia.base.org
- **네트워크**: base-sepolia

## 🧪 테스트

```bash
# 단위 테스트 실행
npm test

# E2E 테스트 실행
npm run test:e2e

# 테스트 커버리지
npm run test:coverage
```

## 🚀 배포

### Vercel 배포

1. Vercel 계정 생성
2. GitHub 저장소 연결
3. 환경 변수 설정
4. 자동 배포 활성화

### 수동 배포

```bash
# 빌드
npm run build

# 정적 파일 생성
npm run export

# 서버에 업로드
```

## 🔒 보안 고려사항

### 지갑 연결
- WalletConnect 프로토콜 사용
- 개인키 절대 저장하지 않음
- 트랜잭션 서명 사용자 확인

### 데이터 검증
- 클라이언트 사이드 입력 검증
- 서버 사이드 데이터 검증
- 스마트 컨트랙트 검증

### 오류 처리
- 네트워크 오류 처리
- 트랜잭션 실패 처리
- 사용자 친화적 오류 메시지

## 🐛 트러블슈팅

### 일반적인 문제들

#### 1. 지갑 연결 실패
```bash
# MetaMask 설치 확인
# 네트워크 설정 확인
# 환경 변수 확인
```

#### 2. 트랜잭션 실패
```bash
# 가스비 확인
# 네트워크 연결 확인
# 컨트랙트 주소 확인
```

#### 3. 빌드 오류
```bash
# 의존성 재설치
npm install

# 캐시 삭제
npm run clean

# TypeScript 오류 확인
npm run type-check
```

## 📞 지원

프론트엔드 관련 문제나 질문이 있으시면:

1. [GitHub Issues](https://github.com/your-repo/issues)에서 이슈 생성
2. [Discord](https://discord.gg/moodipet)에서 커뮤니티 참여
3. [Documentation](https://docs.moodipet.com) 참조

## 🤝 기여하기

프론트엔드 개발에 기여하고 싶으시다면:

1. 저장소 포크
2. 기능 브랜치 생성
3. 코드 작성 및 테스트
4. Pull Request 생성

### 코딩 가이드라인

- TypeScript 사용
- ESLint 규칙 준수
- 컴포넌트 단위 테스트 작성
- 접근성 고려

---

**MoodiPet Frontend** - 감정을 NFT로 만드는 웹 경험 🐾
