// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract LearningRewards {
    string public projectTitle = "Token Rewards for Learning Modules";
    string public projectDescription = "A blockchain-based system that rewards users with tokens upon completing learning modules.";

    address public owner;
    uint256 public rewardAmount;
    mapping(address => uint256) public userTokens;
    mapping(address => bool) public completedModules;

    event TokensRewarded(address indexed user, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    constructor(uint256 _rewardAmount) {
        owner = msg.sender;
        rewardAmount = _rewardAmount;
    }

    function completeModule(address user) external onlyOwner {
        require(!completedModules[user], "Module already completed");
        completedModules[user] = true;
        userTokens[user] += rewardAmount;
        emit TokensRewarded(user, rewardAmount);
    }

    function getUserTokens(address user) external view returns (uint256) {
        return userTokens[user];
    }
}
