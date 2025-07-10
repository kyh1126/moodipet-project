# MoodiPet 슬라임 프로젝트

MoodiPet는 사용자의 감정을 기록하고, 연속 활동에 대한 보상으로 Healing Token을 받아 고유한 감정 기반 슬라임 NFT를 민팅할 수 있는 프로젝트입니다.

## 🎮 게임 설명

- **감정 기록**: 매일 감정을 기록하여 Healing Token을 획득
- **슬라임 성장**: 연속 기록에 따라 알 → 슬라임 → 완성체로 진화
- **NFT 민팅**: 성장한 슬라임을 고유한 NFT로 민팅
- **한국어 지원**: 모든 UI와 메시지가 한국어로 제공

## 🚀 빠른 시작

### 1. 환경 설정
```bash
# 의존성 설치
npm install
cd frontend && npm install
```

### 2. 로컬 네트워크 실행
```bash
npx hardhat node
```

### 3. 스마트 컨트랙트 배포
```bash
npx hardhat run scripts/deploy-local.js --network localhost
```

### 4. 프론트엔드 실행
```bash
cd frontend
npm run dev
```

### 5. 브라우저에서 접속
```
http://localhost:3000
```

## 📁 프로젝트 구조

```
moodipet-project/
├── contracts/           # 스마트 컨트랙트
│   ├── HealingToken.sol    # 감정 기록 및 토큰 보상
│   └── NFT.sol             # 슬라임 NFT 민팅
├── scripts/            # 배포 및 관리 스크립트
│   ├── deploy-local.js     # 로컬 배포
│   ├── deploy-testnet.js   # 테스트넷 배포
│   ├── deploy-mainnet.js   # 메인넷 배포
│   ├── recordMood.js       # 감정 기록
│   ├── recordMoodAuto.js   # 자동 감정 기록 (테스트)
│   ├── mintNFT.js          # NFT 민팅
│   └── evolvePet.js        # 슬라임 진화
├── frontend/           # Next.js 프론트엔드
│   ├── src/
│   │   ├── app/           # 페이지 및 API
│   │   ├── components/    # React 컴포넌트
│   │   └── lib/           # ABI 및 설정
└── test/              # 스마트 컨트랙트 테스트
```

## 🎯 주요 기능

### 감정 기록 시스템
- 7가지 감정: 행복, 우울, 분노, 불안, 설렘, 지루함, 허무
- 연속 기록에 따른 보상 증가
- 7일 연속 기록 시 보너스 토큰 지급

### 슬라임 진화 시스템
- **알 단계**: 감정 기록 시작
- **슬라임 단계**: 연속 기록 3일 이상
- **완성체 단계**: 연속 기록 6일 이상

### NFT 민팅
- 토큰 잔액 1개 이상 시 민팅 가능
- 감정별 고유한 슬라임 속성
- 개인화된 성격 특성

## 🔧 환경별 배포

### 로컬 개발
```bash
npx hardhat run scripts/deploy-local.js --network localhost
```

### 테스트넷 배포
```bash
npx hardhat run scripts/deploy-testnet.js --network baseSepoliaTestnet
```

### 메인넷 배포
```bash
npx hardhat run scripts/deploy-mainnet.js --network baseMainnet
```

## 🛠️ 개발 도구

### 스마트 컨트랙트 테스트
```bash
npx hardhat test
```

### 자동 감정 기록 (테스트용)
```bash
npx hardhat run scripts/recordMoodAuto.js --network localhost
```

### NFT 민팅 테스트
```bash
npx hardhat run scripts/mintNFT.js --network localhost
```

## 📋 환경 변수

### 로컬 개발 (.env)
```
LOCAL_RPC_URL=http://localhost:8545
LOCAL_PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
NEXT_PUBLIC_HEALING_TOKEN_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
NEXT_PUBLIC_MOODIPET_NFT_ADDRESS=0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
```

## 🎨 UI/UX 특징

- **한국어 완전 지원**: 모든 텍스트와 메시지가 한국어
- **감정별 멘트**: 각 감정에 맞는 유머러스한 한글 멘트
- **반응형 디자인**: 모바일과 데스크톱 모두 지원
- **직관적 인터페이스**: 지갑 연결부터 민팅까지 쉬운 사용법

## 🔒 보안

- **Ownable 패턴**: 컨트랙트 소유자만 민팅 가능
- **환경 변수 관리**: 민감한 정보는 .env 파일로 관리
- **테스트 커버리지**: 스마트 컨트랙트 기능별 테스트

## 📞 문제 해결

### 일반적인 문제들
1. **지갑 연결 실패**: MetaMask 설치 및 네트워크 설정 확인
2. **트랜잭션 실패**: 가스비 부족 또는 네트워크 연결 확인
3. **민팅 실패**: 토큰 잔액 및 진화 단계 확인

### 디버깅
```bash
# 상세 로그 확인
DEBUG=* npx hardhat run scripts/deploy-local.js --network localhost
```

## 📄 라이선스

MIT License

## 🤝 기여하기

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
