// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "../oracleContract/leaderBoard.sol";

contract Client {
	// leaderBoard contract
	LeaderBoard public leaderBoard;

	address admin;

	// constructor
	constructor(address _leaderBoardAddress) {
		admin = msg.sender;
		leaderBoard = LeaderBoard(_leaderBoardAddress);
	}

	// onlyAdmin modifier
	modifier onlyAdmin {
		require(msg.sender == admin);
		_;
	}

	// set leaderBoard
	function setLeaderBoard(address _leaderBoardAddress) public onlyAdmin {
		leaderBoard = LeaderBoard(_leaderBoardAddress);
	}

	// get latest round
	function getLatestRound() public view returns (Round memory) {
		return leaderBoard.getLatestRound();
	}


	// get specific round
	function getRound(uint round) public view returns (Round memory) {
		return leaderBoard.getRound(round);
	}

	// get all rounds
	function getAllRounds() public view returns (Round[] memory) {
		return leaderBoard.getAllRounds();
	}

}