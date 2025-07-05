# MoodiPet - Emotion-Based Pet NFT Project

MoodiPet는 사용자의 감정을 기록하고, 연속 활동에 대한 보상으로 Healing Token을 받아 고유한 감정 기반 펫 NFT를 민팅할 수 있는 프로젝트입니다.

## 🚀 프로젝트 구조

```
moodipet-project/
├── contracts/          # 스마트 컨트랙트
│   ├── NFT.sol        # MoodiPet NFT 컨트랙트
│   └── HealingToken.sol # Healing Token 컨트랙트
├── scripts/           # 백엔드 스크립트
│   ├── ContractManager.js
│   ├── mintNFT.js
│   ├── recordMood.js
│   ├── evolvePet.js
│   └── deploy.js
├── test/              # 테스트 코드
│   ├── NFT.ts
│   └── HealingToken.ts
├── frontend/          # 프론트엔드 (Next.js)
└── artifacts/         # 컴파일된 컨트랙트 ABI
```

## 📋 사전 요구사항

- Node.js (v18 이상)
- npm 또는 yarn
- MetaMask 또는 다른 Web3 지갑

## 🛠️ 설치 및 설정

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 다음 내용을 추가하세요:

```env
# 테스트넷 개인키 (MetaMask에서 가져오기)
TESTNET_PRIVATE_KEY=your_private_key_here

# 네트워크 설정
NETWORK=localhost
```

## 🚀 실행 방법

### 1. 로컬 개발 환경 실행

#### 1-1. Hardhat 로컬 노드 시작
```bash
npx hardhat node
```

#### 1-2. 스마트 컨트랙트 배포
```bash
npx hardhat run scripts/deploy.js --network localhost
```

#### 1-3. 프론트엔드 실행
```bash
cd frontend
npm run dev
```

브라우저에서 `http://localhost:3000`으로 접속하세요.

### 2. 테스트 실행

```bash
# 모든 테스트 실행
npx hardhat test

# 특정 테스트 실행
npx hardhat test test/NFT.ts
npx hardhat test test/HealingToken.ts
```

### 3. 백엔드 스크립트 실행

```bash
# NFT 민팅
npx hardhat run scripts/mintNFT.js --network localhost

# 감정 기록
npx hardhat run scripts/recordMood.js --network localhost

# 펫 진화
npx hardhat run scripts/evolvePet.js --network localhost
```

## 📝 스마트 컨트랙트 기능

### HealingToken
- 사용자 감정 기록
- 연속 활동 보상 (Healing Token)
- 7일 연속 기록 시 보너스 토큰
- 사용자 활동 추적

### MoodiPetNFT
- 감정 기반 펫 NFT 민팅
- 펫 속성: 감정, 색상, 진화 단계, 성격
- 펫 진화 기능
- 사용자별 펫 목록 조회

## 🔧 개발 도구

### Hardhat 명령어
```bash
# 컨트랙트 컴파일
npx hardhat compile

# 로컬 노드 시작
npx hardhat node

# 테스트 실행
npx hardhat test

# 배포
npx hardhat run scripts/deploy.js --network localhost
```

### 프론트엔드 명령어
```bash
cd frontend

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 프로덕션 실행
npm start
```

## 🌐 네트워크 설정

### 로컬 개발
- Chain ID: 31337
- RPC URL: http://127.0.0.1:8545
- 네트워크: localhost

### 테스트넷 (Base Sepolia)
- Chain ID: 84532
- RPC URL: https://sepolia.base.org
- 네트워크: base-sepolia

## 📱 프론트엔드 기능

- 지갑 연결 (WalletConnect)
- 감정 기록 및 Healing Token 획득
- MoodiPet NFT 민팅
- 펫 진화 및 관리
- 사용자 활동 대시보드

자세한 프론트엔드 사용법은 [frontend/README.md](./frontend/README.md)를 참조하세요.

## 🧪 테스트

프로젝트에는 다음 테스트가 포함되어 있습니다:

- **HealingToken 테스트**: 10개 테스트
  - 배포 테스트
  - 감정 기록 테스트
  - 토큰 보상 테스트
  - 사용자 정보 테스트
  - 소유자 기능 테스트

- **MoodiPetNFT 테스트**: 13개 테스트
  - 배포 테스트
  - NFT 민팅 테스트
  - 펫 속성 테스트
  - 사용자 펫 테스트
  - 펫 진화 테스트
  - 소유권 이전 테스트

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 📞 문의

프로젝트에 대한 질문이나 제안사항이 있으시면 이슈를 생성해 주세요.
