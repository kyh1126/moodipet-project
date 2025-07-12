// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract HealingToken is ERC20, Ownable {
    // User emotion recording information
    struct MoodRecord {
        uint256 lastRecordTime;
        uint256 consecutiveDays;
        uint256 totalRecords;
    }
    
    mapping(address => MoodRecord) public moodRecords;
    
    // Events
    event MoodRecorded(address indexed user, string emotion, uint256 consecutiveDays);
    event TokensRewarded(address indexed user, uint256 amount, string reason);
    
    constructor(address initialOwner) Ownable(initialOwner) ERC20("Healing Token", "HEAL") {}
    
    // Emotion recording (public)
    function recordMood(address user, string memory emotion) public {
        MoodRecord storage record = moodRecords[user];
        uint256 currentTime = block.timestamp;
        
        // Check if a day has passed (86400 seconds = 24 hours)
        if (currentTime - record.lastRecordTime >= 86400) {
            record.consecutiveDays++;
            record.lastRecordTime = currentTime;
        } else if (currentTime - record.lastRecordTime < 86400) {
            // Prevent duplicate recording on the same day
            return;
        }
        
        record.totalRecords++;
        
        // Reward distribution
        uint256 reward = calculateReward(record.consecutiveDays);
        if (reward > 0) {
            _mint(user, reward);
            emit TokensRewarded(user, reward, "Mood Record");
        }
        
        emit MoodRecorded(user, emotion, record.consecutiveDays);
    }
    
    // Reward calculation
    function calculateReward(uint256 consecutiveDays) internal pure returns (uint256) {
        if (consecutiveDays == 7) {
            return 10; // 10 tokens for 7 consecutive days
        } else if (consecutiveDays % 7 == 0) {
            return 10; // 10 tokens for every multiple of 7
        } else {
            return 1; // Default 1 token
        }
    }
    
    // User information query
    function getUserMoodRecord(address user) public view returns (MoodRecord memory) {
        return moodRecords[user];
    }
    
    // Consecutive recording days query
    function getConsecutiveDays(address user) public view returns (uint256) {
        return moodRecords[user].consecutiveDays;
    }
    
    // Total record count query
    function getTotalRecords(address user) public view returns (uint256) {
        return moodRecords[user].totalRecords;
    }
    
    // Check if 7-day consecutive record is achieved
    function hasCompletedWeek(address user) public view returns (bool) {
        return moodRecords[user].consecutiveDays >= 7;
    }
    
    // Owner token minting (for emergency situations)
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
} 