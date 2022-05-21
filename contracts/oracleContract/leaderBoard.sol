// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

struct Round {
    uint256 id;
    uint256 startAt;
    uint256 endAt;
    address firstWinner;
    address secondWinner;
    address thirdWinner;
}

contract LeaderBoard {
    uint256 totalRounds;
    mapping(uint256 => Round) public roundsMap;
    Round[] public rounds;

    address operator;
    address admin;

    // event new round
    event NewRound(
        uint256 roundId,
        uint256 startAt,
        uint256 endAt,
        address firstWinner,
        address secondWinner,
        address thirdWinner
    );

    // constructor
    constructor(address _operator) {
        totalRounds = 0;
        admin = msg.sender;
        operator = _operator;
    }

    // onlyAdmin modifier
    modifier onlyAdmin() {
        require(msg.sender == admin);
        _;
    }

    // onlyOperator modifier
    modifier onlyOperator() {
        require(msg.sender == operator);
        _;
    }

    // set operator
    function setOperator(address _operator) public onlyAdmin {
        operator = _operator;
    }

    // get latest round
    function getLatestRound() public view returns (Round memory) {
        return roundsMap[totalRounds];
    }

    // get specific round
    function getRound(uint256 round) public view returns (Round memory) {
        return roundsMap[round];
    }

    // add new round
    function addRound(
        uint256 startAt,
        uint256 endAt,
        address firstWinner,
        address secondWinner,
        address thirdWinner
    ) public onlyOperator {
        Round memory newRound;
        newRound.id = totalRounds + 1;
        newRound.startAt = startAt;
        newRound.endAt = endAt;
        newRound.firstWinner = firstWinner;
        newRound.secondWinner = secondWinner;
        newRound.thirdWinner = thirdWinner;
        roundsMap[totalRounds + 1] = newRound;
        totalRounds++;
        rounds.push(newRound);

        emit NewRound(
            newRound.id,
            newRound.startAt,
            newRound.endAt,
            newRound.firstWinner,
            newRound.secondWinner,
            newRound.thirdWinner
        );
    }

    // get rounds
    function getAllRounds() public view returns (Round[] memory) {
        return rounds;
    }
}
