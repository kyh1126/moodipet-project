// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract HealingToken is ERC20, Ownable {
    // 사용자별 감정 기록 정보
    struct MoodRecord {
        uint256 lastRecordTime;
        uint256 consecutiveDays;
        uint256 totalRecords;
    }
    
    mapping(address => MoodRecord) public moodRecords;
    
    // 이벤트
    event MoodRecorded(address indexed user, string emotion, uint256 consecutiveDays);
    event TokensRewarded(address indexed user, uint256 amount, string reason);
    
    constructor(address initialOwner) Ownable(initialOwner) ERC20("Healing Token", "HEAL") {}
    
    // 감정 기록 (오너만 호출 가능)
    function recordMood(address user, string memory emotion) public onlyOwner {
        MoodRecord storage record = moodRecords[user];
        uint256 currentTime = block.timestamp;
        
        // 하루가 지났는지 확인 (86400초 = 24시간)
        if (currentTime - record.lastRecordTime >= 86400) {
            record.consecutiveDays++;
            record.lastRecordTime = currentTime;
        } else if (currentTime - record.lastRecordTime < 86400) {
            // 같은 날 중복 기록 방지
            return;
        }
        
        record.totalRecords++;
        
        // 보상 지급
        uint256 reward = calculateReward(record.consecutiveDays);
        if (reward > 0) {
            _mint(user, reward);
            emit TokensRewarded(user, reward, "Mood Record");
        }
        
        emit MoodRecorded(user, emotion, record.consecutiveDays);
    }
    
    // 보상 계산
    function calculateReward(uint256 consecutiveDays) internal pure returns (uint256) {
        if (consecutiveDays == 7) {
            return 10; // 7일 연속 기록 시 10 토큰
        } else if (consecutiveDays % 7 == 0) {
            return 10; // 7의 배수일 때마다 10 토큰
        } else {
            return 1; // 기본 1 토큰
        }
    }
    
    // 사용자 정보 조회
    function getUserMoodRecord(address user) public view returns (MoodRecord memory) {
        return moodRecords[user];
    }
    
    // 연속 기록일수 조회
    function getConsecutiveDays(address user) public view returns (uint256) {
        return moodRecords[user].consecutiveDays;
    }
    
    // 총 기록 수 조회
    function getTotalRecords(address user) public view returns (uint256) {
        return moodRecords[user].totalRecords;
    }
    
    // 7일 연속 기록 달성 여부 확인
    function hasCompletedWeek(address user) public view returns (bool) {
        return moodRecords[user].consecutiveDays >= 7;
    }
    
    // 오너가 토큰 발행 (긴급 상황용)
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
} 