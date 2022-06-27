# Leader Board Web3 App + Oracle + Service
A proof of concept project that generates random winners for each round and stores them in Blockchain working as Oracle.

## Description
The repository contains all the necessary files to deploy and run a leader board app on localhost.
The core services are:
* Oracle contract (contracs/oracleContract) - Store the rounds
* Operator service (roundsOperator/service) - Update the rounds every 10 minutes on the oracle
* Client contract (contracts/clientContract) - Get the rounds from oracle smart contract
* React app client (client) - Connect to client contract and show the rounds

## Stack
* Nodejs
* React
* Typescript
* Solidity
* Hardhat

## Initialize
* Install dependencies in root folder
  ```npm install```
* Install dependecies in client folder
  ``` cd client```
  and 
  ```npm install```
  

## Use
Run the commands from the root of the project
1. Run hardhat node
  ```npm run node```
2. Place your PRIVATE_KEY in .env file

3. Deploy smart contracts (in new terminal)
  ```npm run deploy```
3. Run Operator Service
  ```npm run service```
4. Open client (in new terminal)
  ```npm run client```

## Test
There are tests for the smart contracts in test folder.
Run them with the command: ```npm run test```
