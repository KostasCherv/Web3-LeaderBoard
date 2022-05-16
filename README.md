# Blockchain developer assignment

### Why
At Wappier, we are interested in your technical skills as a developer and we would like to see how you code.

### Instructions
As part of this assignment you are tasked with creating a proof of concept leader board Oracle-service that allows any contract or externally owned account (EOA) to retrieve the top 3 wallet addresses that participated in an in-game contest. Contests are executed in rounds and are being managed by an operator-service, each round has 3 winners and the information of each round is published to the Oracle every 10 minutes by the operator service. An example round can be seen in the `exampleData.json`.

Your solution should be showcasing how the operator-service can sync off-chain data to the Oracle contract, and provide an example 3rd party contract that can consume the round data.

The Oracle contract should support an operator user who's wallet will be allowed to update only the round information served by the Oracle, and this Operator could be configured at any time by the Oracle owner.

The Oracle contract should store all rounds synced by the operator and needs to provide a way for others (contracts and/or EOA) to retrieve the round data both for the most recent round and for a specific round from it.

The operator service needs to update the data on the Oracle every 10 minutes.

#### Note
The way of selecting the 3 wallet addresses (winners) that should be communicated to the Oracle is not in scope of this assignment, so you can provide randomly generated wallet addresses. 

### Deliverables
- The operator service syncing information to the Oracle
- The Oracle smart contract and their migrations 
- An example Client smart contract

### Constraints
Please complete the assignment in 5 days, there are no limitations on the tools you can use, use what you feel comfortable with.

### Questions
If you have any questions please send an email to Tech_HR@wappier.com

### Finished?
Please send an email to Tech_HR@wappier.com and let us know.

🧱⛓ Good luck 🧱⛓
