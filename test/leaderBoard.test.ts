import '@nomiclabs/hardhat-ethers'
import { ethers } from 'hardhat'
import { Contract } from 'ethers'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address'
import moment from 'moment'
import { IRound } from '../roundsOperatorService/Round.interface'
import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'

chai.use(chaiAsPromised)
const { expect } = chai

// test leaderBoard smart contract with chai
describe('LeaderBoard', () => {
    let leaderBoard: Contract
    let admin: SignerWithAddress,
        operator: SignerWithAddress,
        user1: SignerWithAddress

    before('deploy leaderBoard', async () => {
        const signers = await ethers.getSigners()
        admin = signers[0]
        operator = signers[1]
        user1 = signers[2]
    })

    beforeEach(async () => {
        const LeaderBoardContract = await ethers.getContractFactory(
            'LeaderBoard',
        )
        leaderBoard = await LeaderBoardContract.deploy(operator.address)
        await leaderBoard.deployed()
    })

    it('should return empty rounds array', async () => {
        const rounds = await leaderBoard.getAllRounds()
        expect(rounds).to.be.an('array')
        expect(rounds).to.have.lengthOf(0)
    })

    it('should add one round', async () => {
        const round: IRound = {
            firstWinner: user1.address,
            secondWinner: user1.address,
            thirdWinner: user1.address,
            startAt: moment().unix(),
            endAt: moment().add(10, 'minutes').unix(),
        }
        await leaderBoard
            .connect(operator)
            .addRound(
                round.startAt,
                round.endAt,
                round.firstWinner,
                round.secondWinner,
                round.thirdWinner,
            )
        const rounds = await leaderBoard.getAllRounds()
        expect(rounds).to.be.an('array')
        expect(rounds).to.have.lengthOf(1)
        expect(rounds[0].id).to.equal(1)
        expect(rounds[0].firstWinner).to.equal(round.firstWinner)
        expect(rounds[0].secondWinner).to.equal(round.secondWinner)
        expect(rounds[0].thirdWinner).to.equal(round.thirdWinner)
        expect(rounds[0].startAt).to.equal(round.startAt)
        expect(rounds[0].endAt).to.equal(round.endAt)
    })

    it('should add two rounds and get the first by id', async () => {
        const round1: IRound = {
            firstWinner: user1.address,
            secondWinner: user1.address,
            thirdWinner: user1.address,
            startAt: moment().unix(),
            endAt: moment().add(10, 'minutes').unix(),
        }
        const round2: IRound = {
            firstWinner: user1.address,
            secondWinner: user1.address,
            thirdWinner: user1.address,
            startAt: moment().add(10, 'minutes').unix(),
            endAt: moment().add(20, 'minutes').unix(),
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
        await leaderBoard
            .connect(operator)
            .addRound(
                round2.startAt,
                round2.endAt,
                round2.firstWinner,
                round2.secondWinner,
                round2.thirdWinner,
            )
        const rounds = await leaderBoard.getAllRounds()
        expect(rounds).to.be.an('array')
        expect(rounds).to.have.lengthOf(2)

        const firstRound = await leaderBoard.getRound(1)
        expect(rounds[0].id).to.equal(1)
        expect(firstRound.firstWinner).to.equal(round1.firstWinner)
        expect(firstRound.secondWinner).to.equal(round1.secondWinner)
        expect(firstRound.thirdWinner).to.equal(round1.thirdWinner)
        expect(firstRound.startAt).to.equal(round1.startAt)
        expect(firstRound.endAt).to.equal(round1.endAt)
    })

    // get latest round
    it('should get latest round', async () => {
        const round1: IRound = {
            firstWinner: user1.address,
            secondWinner: user1.address,
            thirdWinner: user1.address,
            startAt: moment().unix(),
            endAt: moment().add(10, 'minutes').unix(),
        }
        const round2: IRound = {
            firstWinner: user1.address,
            secondWinner: user1.address,
            thirdWinner: user1.address,
            startAt: moment().add(10, 'minutes').unix(),
            endAt: moment().add(20, 'minutes').unix(),
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
        await leaderBoard
            .connect(operator)
            .addRound(
                round2.startAt,
                round2.endAt,
                round2.firstWinner,
                round2.secondWinner,
                round2.thirdWinner,
            )
        const latestRound = await leaderBoard.getLatestRound()
        expect(latestRound.id).to.equal(2)
        expect(latestRound.firstWinner).to.equal(round2.firstWinner)
        expect(latestRound.secondWinner).to.equal(round2.secondWinner)
        expect(latestRound.thirdWinner).to.equal(round2.thirdWinner)
        expect(latestRound.startAt).to.equal(round2.startAt)
        expect(latestRound.endAt).to.equal(round2.endAt)
    })

    // throw error when add from any other user than operator
    it('should throw error when add round from any other user than operator', async () => {
        const round: IRound = {
            firstWinner: user1.address,
            secondWinner: user1.address,
            thirdWinner: user1.address,
            startAt: moment().unix(),
            endAt: moment().add(10, 'minutes').unix(),
        }

        await expect(
            leaderBoard
                .connect(user1)
                .addRound(
                    round.startAt,
                    round.endAt,
                    round.firstWinner,
                    round.secondWinner,
                    round.thirdWinner,
                ),
        ).to.be.rejected
    })

    // set operator by admin
    it('should set operator by admin and add round', async () => {
        await expect(leaderBoard.connect(admin).setOperator(user1.address)).to
            .be.fulfilled

        // add round with new operator
        const round: IRound = {
            firstWinner: user1.address,
            secondWinner: user1.address,
            thirdWinner: user1.address,
            startAt: moment().unix(),
            endAt: moment().add(10, 'minutes').unix(),
        }
        await leaderBoard
            .connect(user1)
            .addRound(
                round.startAt,
                round.endAt,
                round.firstWinner,
                round.secondWinner,
                round.thirdWinner,
            )
        const rounds = await leaderBoard.getAllRounds()
        expect(rounds).to.be.an('array')
        expect(rounds).to.have.lengthOf(1)
    })

    // set operator by operator and fail
    it('should set operator by operator and fail', async () => {
        await expect(leaderBoard.connect(operator).setOperator(user1.address))
            .to.be.rejected
    })

    // add round and check event data
    it('should add round and check event data', async () => {
        const round: IRound = {
            firstWinner: user1.address,
            secondWinner: user1.address,
            thirdWinner: user1.address,
            startAt: moment().unix(),
            endAt: moment().add(10, 'minutes').unix(),
        }
        const tx = await leaderBoard
            .connect(operator)
            .addRound(
                round.startAt,
                round.endAt,
                round.firstWinner,
                round.secondWinner,
                round.thirdWinner,
            )
        const response = await tx.wait()
        const eventData = response.events[0]
        expect(eventData.event).to.equal('NewRound')
        expect(eventData.args.roundId).to.equal(1)
        expect(eventData.args.startAt).to.equal(round.startAt)
        expect(eventData.args.endAt).to.equal(round.endAt)
        expect(eventData.args.firstWinner).to.equal(round.firstWinner)
        expect(eventData.args.secondWinner).to.equal(round.secondWinner)
        expect(eventData.args.thirdWinner).to.equal(round.thirdWinner)
    })
})
