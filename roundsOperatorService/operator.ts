import { ethers } from 'ethers'
import moment from 'moment'
import { IRound } from './Round.interface'

// class operator
export class Operator {
    private contractAddress: string
    private abi: any
    private provider: ethers.providers.Provider
    private privateKey: ethers.utils.SigningKey
    private contract: ethers.Contract
    private wallet: ethers.Wallet

    constructor(
        contractAddress: string,
        abi: any,
        provider: ethers.providers.Provider,
        privateKey: ethers.utils.SigningKey,
    ) {
        this.contractAddress = contractAddress
        this.abi = abi
        this.provider = provider
        this.privateKey = privateKey
        this.contract = new ethers.Contract(
            this.contractAddress,
            this.abi,
            this.provider,
        )
        this.wallet = new ethers.Wallet(this.privateKey, this.provider)
    }

    // create random winner address
    private getRandomWinner() {
        const wallet = ethers.Wallet.createRandom()
        return wallet.address
    }

    // create round data
    private async getRoundData(): Promise<IRound> {
        return {
            firstWinner: this.getRandomWinner(),
            secondWinner: this.getRandomWinner(),
            thirdWinner: this.getRandomWinner(),
            startAt: moment().unix(),
            endAt: moment().add(10, 'minutes').unix(),
        }
    }

    // add round on smart contract address using wallet
    public async addRound() {
        try {
            const round = await this.getRoundData()
            await this.contract
                .connect(this.wallet)
                .addRound(
                    round.startAt,
                    round.endAt,
                    round.firstWinner,
                    round.secondWinner,
                    round.thirdWinner,
                )
        } catch (error) {
            console.log(error)
        }
    }
}
