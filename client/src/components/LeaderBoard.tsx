import { ethers } from 'ethers'
import moment from 'moment'
import { useEffect, useState } from 'react'
import CLIENT_ABI from '../contracts/Client.json'
import config from './../contracts/config.json'

import { BasicTable } from './BasicTable'

const LeaderBoard = () => {
    const [leaderBoard, setLeaderBoard] = useState([])
    const headers = [
        'StartAt',
        'EndAt',
        'First Winner',
        'Second Winner',
        'Third Winner',
    ]
    const fetchLeaderBoard = async () => {
        const provider = new ethers.providers.Web3Provider(
            (window as any).ethereum,
        )
        const contract = new ethers.Contract(
            config.client,
            CLIENT_ABI.abi,
            provider,
        )

        const roundsData = await contract.getAllRounds()
        const leaderBoard = roundsData.map((round: any) => {
            return [
                moment.unix(round.startAt.toString()).toString(),
                moment.unix(round.endAt.toString()).toString(),
                round.firstWinner,
                round.secondWinner,
                round.thirdWinner,
            ]
        })
        setLeaderBoard(leaderBoard)
    }

    useEffect(() => {
        fetchLeaderBoard()
    }, [])

    setInterval(() => {
        fetchLeaderBoard()
    }, 60 * 1000 * 1)

    return <BasicTable headers={headers} rows={leaderBoard} />
}

export default LeaderBoard
