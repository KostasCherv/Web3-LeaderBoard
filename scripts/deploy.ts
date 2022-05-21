import dotenv from 'dotenv'
import { Wallet } from 'ethers'
import * as fs from 'fs'
dotenv.config()

async function deployLeaderBoard(admin: Wallet, operator: string) {
    // @ts-ignore
    const LeaderBoardContract = await ethers.getContractFactory('LeaderBoard')
    const leaderBoard = await LeaderBoardContract.connect(admin).deploy(
        operator,
        {
            gasLimit: 30000000,
        },
    )
    await leaderBoard.deployed()
    console.log('Leaderboard deployed to:', leaderBoard.address)
    fs.writeFileSync(
        './roundsOperatorService/config.json',
        JSON.stringify({
            leaderBoard: leaderBoard.address,
        }),
    )
    return leaderBoard
}

async function deployClient(leaderBoardAddress: string) {
    // @ts-ignore
    const ClientContract = await ethers.getContractFactory('Client')
    const client = await ClientContract.deploy(leaderBoardAddress)
    await client.deployed()
    console.log('Client deployed to:', client.address)
    fs.copyFileSync(
        './artifacts/contracts/clientContract/client.sol/Client.json',
        './client/src/contracts/Client.json',
    )
    fs.writeFileSync(
        './client/src/contracts/config.json',
        JSON.stringify({
            client: client.address,
        }),
    )
    return client
}

async function main() {
    // @ts-ignore
    const [admin, operator] = await ethers.getSigners()
    const leaderBoard = await deployLeaderBoard(admin, operator.address)
    const client = await deployClient(leaderBoard.address)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
