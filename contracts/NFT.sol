// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract MoodiPetNFT is Ownable, ERC721URIStorage {
    uint256 private _nextTokenId = 1;
    
    // 감정 펫의 속성 구조체
    struct PetAttributes {
        string emotion;      // 감정 (우울, 기쁨, 화남, 평온 등)
        string color;        // 색깔
        uint8 evolution;     // 진화 정도 (1-5)
        uint256 createdAt;   // 생성 시간
        string personality;  // 성격
    }
    
    // 토큰 ID별 속성 매핑
    mapping(uint256 => PetAttributes) public petAttributes;
    
    // 사용자별 소유한 펫 수
    mapping(address => uint256) public userPetCount;
    
    // 이벤트
    event PetMinted(address indexed owner, uint256 indexed tokenId, string emotion, string color, uint8 evolution);
    
    constructor(address initialOwner) Ownable(initialOwner) ERC721("MoodiPet", "MDP") {}
    
    // 감정 펫 민팅 함수
    function mintMoodiPet(
        address to, 
        string memory uri,
        string memory _emotion,
        string memory _color,
        uint8 _evolution,
        string memory _personality
    ) public onlyOwner {
        require(_evolution >= 1 && _evolution <= 5, "Evolution level must be between 1 and 5");
        
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        
        petAttributes[tokenId] = PetAttributes({
            emotion: _emotion,
            color: _color,
            evolution: _evolution,
            createdAt: block.timestamp,
            personality: _personality
        });
        
        userPetCount[to]++;
        
        emit PetMinted(to, tokenId, _emotion, _color, _evolution);
    }
    
    // 펫 속성 조회
    function getPetAttributes(uint256 tokenId) public view returns (PetAttributes memory) {
        require(ownerOf(tokenId) != address(0), "Token does not exist");
        return petAttributes[tokenId];
    }
    
    // 사용자의 모든 펫 조회
    function getUserPets(address user) public view returns (uint256[] memory) {
        uint256[] memory pets = new uint256[](userPetCount[user]);
        uint256 count = 0;
        
        for (uint256 i = 1; i < _nextTokenId; i++) {
            if (ownerOf(i) == user) {
                pets[count] = i;
                count++;
            }
        }
        
        return pets;
    }
    
    // 펫 진화 업그레이드 (오너만 가능)
    function evolvePet(uint256 tokenId, uint8 newEvolution) public onlyOwner {
        require(ownerOf(tokenId) != address(0), "Token does not exist");
        require(newEvolution > petAttributes[tokenId].evolution && newEvolution <= 5, "Invalid evolution level");
        
        petAttributes[tokenId].evolution = newEvolution;
    }
}
