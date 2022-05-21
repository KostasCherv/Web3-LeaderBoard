import dotenv from 'dotenv'
import * as fs from 'fs'
dotenv.config()
import { BytesLike, ethers } from 'ethers'
import { CronJob } from 'cron'
import { Operator } from './operator'
import config from './config.json'

const privateKey = new ethers.utils.SigningKey(
    process.env.PRIVATE_KEY as BytesLike,
)
const contractAddress = config.leaderBoard
const abiFile =
    './artifacts/contracts/oracleContract/leaderBoard.sol/LeaderBoard.json'

// ensure variables are set
if (!privateKey || !contractAddress || !abiFile) {
    console.log('Please set variables in .env file')
    process.exit(1)
}
const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545/')
const abi = JSON.parse(fs.readFileSync(abiFile, 'utf8')).abi

const operator = new Operator(contractAddress, abi, provider, privateKey)

const main = async () => {
    try {
        await operator.addRound()
        console.log('Round added at ' + new Date())
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

const job = new CronJob('* */10 * * * *', main)
console.log('Service start')
job.start()
