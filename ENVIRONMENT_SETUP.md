# MoodiPet 슬라임 환경별 설정 가이드

## 📋 개요

MoodiPet 슬라임 프로젝트는 다음 환경들을 지원합니다:
- **로컬 개발 환경** (localhost)
- **테스트넷** (Base Sepolia)
- **메인넷** (Base Mainnet)

## 🚀 환경별 배포 방법

### 1. 로컬 개발 환경

#### 1.1 환경 설정
```bash
# .env 파일 생성 (env.local.example 참고)
cp env.local.example .env
```

#### 1.2 하드햇 노드 실행
```bash
npx hardhat node
```

#### 1.3 컨트랙트 배포
```bash
npx hardhat run scripts/deploy-local.js --network localhost
```

#### 1.4 프론트엔드 실행
```bash
cd frontend
npm run dev
```

### 2. 테스트넷 환경

#### 2.1 환경 설정
```bash
# .env 파일 생성 (env.testnet.example 참고)
cp env.testnet.example .env
# 실제 값으로 수정
```

#### 2.2 필수 설정
- `TESTNET_PRIVATE_KEY`: 실제 지갑 프라이빗 키
- `BASESCAN_API_KEY`: BaseScan API 키 (컨트랙트 검증용)

#### 2.3 컨트랙트 배포
```bash
npx hardhat run scripts/deploy-testnet.js --network baseSepoliaTestnet
```

#### 2.4 컨트랙트 검증
```bash
npx hardhat verify --network baseSepoliaTestnet [CONTRACT_ADDRESS] [CONSTRUCTOR_ARGS]
```

### 3. 메인넷 환경

#### 3.1 환경 설정
```bash
# .env 파일 생성 (env.mainnet.example 참고)
cp env.mainnet.example .env
# 실제 값으로 수정
```

#### 3.2 필수 설정
- `MAINNET_PRIVATE_KEY`: 실제 지갑 프라이빗 키
- `BASESCAN_API_KEY`: BaseScan API 키

#### 3.3 컨트랙트 배포
```bash
npx hardhat run scripts/deploy-mainnet.js --network baseMainnet
```

## 🔧 환경변수 설명

### 공통 설정
- `LOCAL_RPC_URL`: 로컬 하드햇 노드 URL
- `BASE_SEPOLIA_RPC_URL`: Base Sepolia 테스트넷 RPC URL
- `BASE_MAINNET_RPC_URL`: Base 메인넷 RPC URL
- `SEPOLIA_RPC_URL`: Ethereum Sepolia 테스트넷 RPC URL

### 프라이빗 키
- `LOCAL_PRIVATE_KEY`: 로컬 개발용 프라이빗 키
- `TESTNET_PRIVATE_KEY`: 테스트넷용 프라이빗 키
- `MAINNET_PRIVATE_KEY`: 메인넷용 프라이빗 키

### 컨트랙트 주소
- `NEXT_PUBLIC_HEALING_TOKEN_ADDRESS`: HealingToken 컨트랙트 주소
- `NEXT_PUBLIC_MOODIPET_NFT_ADDRESS`: MoodiPet 슬라임 NFT 컨트랙트 주소

### API 키
- `BASESCAN_API_KEY`: BaseScan API 키 (컨트랙트 검증용)

### 프론트엔드 설정
- `NEXT_PUBLIC_BASE_URL`: 프론트엔드 기본 URL
- `NEXT_PUBLIC_NETWORK`: 현재 네트워크 이름

## 🛠️ 유용한 명령어

### 환경 확인
```bash
# 현재 네트워크 확인
npx hardhat console --network localhost
```

### 컨트랙트 테스트
```bash
# 감정 기록 테스트
npx hardhat run scripts/recordMood.js --network localhost

# NFT 민팅 테스트
npx hardhat run scripts/mintNFT.js --network localhost
```

### 잔액 확인
```bash
# 배포자 잔액 확인
npx hardhat run scripts/checkBalance.js --network localhost
```

## ⚠️ 주의사항

1. **프라이빗 키 보안**: 실제 프라이빗 키는 절대 공개하지 마세요
2. **메인넷 배포**: 메인넷 배포 전 충분한 테스트를 진행하세요
3. **가스비**: 테스트넷/메인넷 배포 시 충분한 가스비를 확보하세요
4. **환경변수**: 각 환경별로 올바른 환경변수를 설정하세요

## 🔄 환경 전환

### 로컬 → 테스트넷
1. `.env` 파일의 네트워크 설정 변경
2. `TESTNET_PRIVATE_KEY` 설정
3. 배포 스크립트 실행

### 테스트넷 → 메인넷
1. `.env` 파일의 네트워크 설정 변경
2. `MAINNET_PRIVATE_KEY` 설정
3. 충분한 테스트 후 배포

## 📞 문제 해결

### 일반적인 문제들
1. **RPC 연결 실패**: 네트워크 URL 확인
2. **가스비 부족**: 계정 잔액 확인
3. **컨트랙트 검증 실패**: API 키 확인
4. **환경변수 오류**: `.env` 파일 경로 확인

### 디버깅
```bash
# 상세 로그 확인
DEBUG=* npx hardhat run scripts/deploy-local.js --network localhost
``` 