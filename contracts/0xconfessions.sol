// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

/**
 * @title AnonymousConfessions
 * @dev A contract that allows users to post anonymous confessions and upvote them
 */
contract AnonymousConfessions {
    // Maximum length of confession text in characters
    uint256 public constant MAX_CONFESSION_LENGTH = 280;
    
    // Number of top confessions to track
    uint256 public constant TOP_CONFESSIONS_COUNT = 10;
    
    // Total confessions counter
    uint256 public totalConfessionsCount;
    
    // Confession structure stored in contract
    struct Confession {
        string text;
        uint256 timestamp;
        uint256 upvotes;
    }
    
    // Structure that includes confession data with its ID for frontend use
    struct ConfessionWithId {
        uint256 id;
        string text;
        uint256 timestamp;
        uint256 upvotes;
    }
    
    // Array to store all confessions
    Confession[] private confessions;
    
    // Track top confessions by ID
    uint256[] private topConfessionIds;
    
    // Track if an address has already upvoted a confession
    mapping(address => mapping(uint256 => bool)) private hasUpvoted;
    
    // Events
    event ConfessionAdded(uint256 indexed confessionId, uint256 timestamp);
    event ConfessionUpvoted(uint256 indexed confessionId, uint256 newUpvoteCount);
    event TopConfessionsUpdated(uint256[] topConfessionIds);
    
    constructor() {
        // Initialize empty top confessions array
        topConfessionIds = new uint256[](0);
        
        // Initialize counter
        totalConfessionsCount = 0;
    }
    
    /**
     * @dev Posts a new anonymous confession
     * @param _text The confession text
     */
    function confess(string calldata _text) external {
        // Validate text length
        require(bytes(_text).length > 0, "Confession cannot be empty");
        require(bytes(_text).length <= MAX_CONFESSION_LENGTH, "Confession too long");
        
        // Create and store the confession
        confessions.push(Confession({
            text: _text,
            timestamp: block.timestamp,
            upvotes: 0
        }));
        
        // Increment the total confessions counter
        totalConfessionsCount++;
        
        uint256 newConfessionId = confessions.length - 1;
        
        // Emit event without including the sender address
        emit ConfessionAdded(newConfessionId, block.timestamp);
    }
    
    /**
     * @dev Upvote a confession
     * @param _confessionId The ID of the confession to upvote
     */
    function upvoteConfession(uint256 _confessionId) external {
        require(_confessionId < confessions.length, "Confession does not exist");
        require(!hasUpvoted[msg.sender][_confessionId], "Already upvoted this confession");
        
        // Record that this address has upvoted this confession
        hasUpvoted[msg.sender][_confessionId] = true;
        
        // Increment upvote count
        confessions[_confessionId].upvotes++;
        
        // Update top confessions if needed
        _updateTopConfessions(_confessionId);
        
        // Emit upvote event
        emit ConfessionUpvoted(_confessionId, confessions[_confessionId].upvotes);
    }
    
    /**
     * @dev Update the top confessions list when a confession is upvoted
     * @param _confessionId The ID of the confession that was upvoted
     */
    function _updateTopConfessions(uint256 _confessionId) private {
        uint256 currentUpvotes = confessions[_confessionId].upvotes;
        
        // If we have fewer than TOP_CONFESSIONS_COUNT, just add it
        if (topConfessionIds.length < TOP_CONFESSIONS_COUNT) {
            // Check if confession is already in the top list
            bool alreadyIncluded = false;
            for (uint256 i = 0; i < topConfessionIds.length; i++) {
                if (topConfessionIds[i] == _confessionId) {
                    alreadyIncluded = true;
                    break;
                }
            }
            
            if (!alreadyIncluded) {
                topConfessionIds.push(_confessionId);
                // If we've just added enough to fill the array, sort it once
                if (topConfessionIds.length == TOP_CONFESSIONS_COUNT) {
                    _sortTopConfessions();
                }
                emit TopConfessionsUpdated(topConfessionIds);
                return;
            }
        }
        
        // If we already have TOP_CONFESSIONS_COUNT confessions, check if this one should be included
        if (topConfessionIds.length == TOP_CONFESSIONS_COUNT) {
            // First check if the confession is already in the top list
            for (uint256 i = 0; i < topConfessionIds.length; i++) {
                if (topConfessionIds[i] == _confessionId) {
                    // It's already in the list, so sort the list to maintain order
                    _sortTopConfessions();
                    emit TopConfessionsUpdated(topConfessionIds);
                    return;
                }
            }
            
            // It's not in the list, so check if it should replace the lowest upvoted one
            uint256 lowestUpvotes = confessions[topConfessionIds[TOP_CONFESSIONS_COUNT - 1]].upvotes;
            
            if (currentUpvotes > lowestUpvotes) {
                // Replace the lowest upvoted confession with this one
                topConfessionIds[TOP_CONFESSIONS_COUNT - 1] = _confessionId;
                _sortTopConfessions();
                emit TopConfessionsUpdated(topConfessionIds);
            }
        }
    }
    
    /**
     * @dev Sort the top confessions by upvote count (highest first)
     * Using a simple insertion sort since the array is small (max 10 elements)
     */
    function _sortTopConfessions() private {
        for (uint i = 1; i < topConfessionIds.length; i++) {
            uint256 currentId = topConfessionIds[i];
            uint256 currentUpvotes = confessions[currentId].upvotes;
            uint j = i;
            
            while (j > 0 && confessions[topConfessionIds[j - 1]].upvotes < currentUpvotes) {
                topConfessionIds[j] = topConfessionIds[j - 1];
                j--;
            }
            
            topConfessionIds[j] = currentId;
        }
    }
    
    /**
     * @dev Get a specific confession by ID
     * @param _id The confession ID
     * @return text The confession text
     * @return timestamp The time when confession was posted
     * @return upvotes The number of upvotes
     */
    function getConfession(uint256 _id) external view returns (
        string memory text, 
        uint256 timestamp, 
        uint256 upvotes
    ) {
        require(_id < confessions.length, "Confession does not exist");
        Confession storage confession = confessions[_id];
        return (confession.text, confession.timestamp, confession.upvotes);
    }
    
    /**
     * @dev Get multiple confessions in a single call
     * @param _startId The starting confession ID
     * @param _count The number of confessions to retrieve
     * @return result Array of confessions with their IDs
     */
    function getConfessions(uint256 _startId, uint256 _count) external view returns (ConfessionWithId[] memory) {
        require(_startId < confessions.length, "Start ID out of range");
        
        // Cap the count to avoid exceeding array bounds
        uint256 endId = _startId + _count;
        if (endId > confessions.length) {
            endId = confessions.length;
            _count = endId - _startId;
        }
        
        ConfessionWithId[] memory result = new ConfessionWithId[](_count);
        for (uint256 i = 0; i < _count; i++) {
            uint256 confessionId = _startId + i;
            result[i] = ConfessionWithId({
                id: confessionId,
                text: confessions[confessionId].text,
                timestamp: confessions[confessionId].timestamp,
                upvotes: confessions[confessionId].upvotes
            });
        }
        
        return result;
    }
    
    /**
     * @dev Get the most recent confessions
     * @param _count The number of recent confessions to retrieve
     * @return result Array of recent confessions with their IDs
     */
    function getRecentConfessions(uint256 _count) external view returns (ConfessionWithId[] memory) {
        uint256 start = confessions.length > _count ? confessions.length - _count : 0;
        uint256 resultCount = confessions.length > _count ? _count : confessions.length;
        
        ConfessionWithId[] memory result = new ConfessionWithId[](resultCount);
        for (uint256 i = 0; i < resultCount; i++) {
            uint256 confessionId = start + i;
            result[i] = ConfessionWithId({
                id: confessionId,
                text: confessions[confessionId].text,
                timestamp: confessions[confessionId].timestamp,
                upvotes: confessions[confessionId].upvotes
            });
        }
        
        return result;
    }
    
    /**
     * @dev Get the top confessions by upvote count (includes IDs)
     * @return Array of top confessions with their IDs
     */
    function getTopConfessions() external view returns (ConfessionWithId[] memory) {
        ConfessionWithId[] memory result = new ConfessionWithId[](topConfessionIds.length);
        
        for (uint256 i = 0; i < topConfessionIds.length; i++) {
            uint256 confessionId = topConfessionIds[i];
            result[i] = ConfessionWithId({
                id: confessionId,
                text: confessions[confessionId].text,
                timestamp: confessions[confessionId].timestamp,
                upvotes: confessions[confessionId].upvotes
            });
        }
        
        return result;
    }
    
    /**
     * @dev Check if current user has already upvoted a confession
     * @param _confessionId The confession ID
     * @return True if current user has upvoted the confession
     */
    function hasUserUpvoted(uint256 _confessionId) external view returns (bool) {
        require(_confessionId < confessions.length, "Confession does not exist");
        return hasUpvoted[msg.sender][_confessionId];
    }
}
