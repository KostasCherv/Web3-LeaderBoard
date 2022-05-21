import '@nomiclabs/hardhat-ethers'
import { ethers } from 'hardhat'
import { Contract } from 'ethers'
import { IRound } from '../roundsOperatorService/Round.interface'
import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import moment from 'moment'

chai.use(chaiAsPromised)
const { expect } = chai

// test leaderBoard smart contract with chai
describe('Client', () => {
    let client: Contract
    let round1: IRound, round2: IRound

    const setUpLeaderBoard = async () => {
        const signers = await ethers.getSigners()
        const operator = signers[1]
        const LeaderBoardContract = await ethers.getContractFactory(
            'LeaderBoard',
        )

        const leaderBoard = await LeaderBoardContract.deploy(operator.address)
        await leaderBoard.deployed()

        // add 2 rounds
        round1 = {
            firstWinner: '0x0000000000000000000000000000000000000001',
            secondWinner: '0x0000000000000000000000000000000000000002',
            thirdWinner: '0x0000000000000000000000000000000000000003',
            startAt: moment().unix(),
            endAt: moment().add(10, 'minutes').unix(),
        }
        await leaderBoard
            .connect(operator)
            .addRound(
                round1.startAt,
                round1.endAt,
                round1.firstWinner,
                round1.secondWinner,
                round1.thirdWinner,
            )
        round2 = {
            firstWinner: '0x0000000000000000000000000000000000000001',
            secondWinner: '0x0000000000000000000000000000000000000002',
            thirdWinner: '0x0000000000000000000000000000000000000003',
            startAt: moment().unix(),
            endAt: moment().add(10, 'minutes').unix(),
        }

        await leaderBoard
            .connect(operator)
            .addRound(
                round2.startAt,
                round2.endAt,
                round2.firstWinner,
                round2.secondWinner,
                round2.thirdWinner,
            )

        return leaderBoard
    }

    beforeEach(async () => {
        const leaderBoard = await setUpLeaderBoard()
        const clientContract = await ethers.getContractFactory('Client')
        client = await clientContract.deploy(leaderBoard.address)
        await client.deployed()
    })

    // get all rounds
    it('should return empty rounds array', async () => {
        const rounds = await client.getAllRounds()
        expect(rounds).to.be.an('array')
        expect(rounds).to.have.lengthOf(2)
    })

    // get latest round
    it('should return latest round', async () => {
        const latestRound = await client.getLatestRound()
        expect(latestRound.id).to.equal(2)
        expect(latestRound.firstWinner).to.equal(round2.firstWinner)
        expect(latestRound.secondWinner).to.equal(round2.secondWinner)
        expect(latestRound.thirdWinner).to.equal(round2.thirdWinner)
        expect(latestRound.startAt).to.equal(round2.startAt)
        expect(latestRound.endAt).to.equal(round2.endAt)
    })

    // get first round
    it('should return first round', async () => {
		const latestRound = await client.getRound(1)
        expect(latestRound.id).to.equal(1)
        expect(latestRound.firstWinner).to.equal(round1.firstWinner)
        expect(latestRound.secondWinner).to.equal(round1.secondWinner)
        expect(latestRound.thirdWinner).to.equal(round1.thirdWinner)
        expect(latestRound.startAt).to.equal(round1.startAt)
        expect(latestRound.endAt).to.equal(round1.endAt)
    })
})
