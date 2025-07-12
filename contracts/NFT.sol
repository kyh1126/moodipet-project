// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract MoodiPetNFT is Ownable, ERC721URIStorage {
    uint256 private _nextTokenId = 1;
    
    // Emotion slime attributes structure
    struct PetAttributes {
        string emotion;      // Emotion (sad, happy, angry, calm, etc.)
        string color;        // Color
        uint8 evolution;     // Evolution level (1-5)
        uint256 createdAt;   // Creation time
        string personality;  // Personality
    }
    
    // Token ID to attributes mapping
    mapping(uint256 => PetAttributes) public petAttributes;
    
    // User's owned slime count
    mapping(address => uint256) public userPetCount;
    
    // Events
    event PetMinted(address indexed owner, uint256 indexed tokenId, string emotion, string color, uint8 evolution);
    
    constructor(address initialOwner) Ownable(initialOwner) ERC721("MoodiPet", "MDP") {}
    
    // Emotion slime minting function
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
    
    // Slime attributes query
    function getPetAttributes(uint256 tokenId) public view returns (PetAttributes memory) {
        require(ownerOf(tokenId) != address(0), "Token does not exist");
        return petAttributes[tokenId];
    }
    
    // Query all user's slimes
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
    
    // Slime evolution upgrade (owner only)
    function evolvePet(uint256 tokenId, uint8 newEvolution) public onlyOwner {
        require(ownerOf(tokenId) != address(0), "Token does not exist");
        require(newEvolution > petAttributes[tokenId].evolution && newEvolution <= 5, "Invalid evolution level");
        
        petAttributes[tokenId].evolution = newEvolution;
    }
}
