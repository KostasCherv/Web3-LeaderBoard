import React, { useState } from 'react'
import Button from '@mui/material/Button'
import { ethers } from 'ethers'

export default function Metamask() {
    const [selectedAddress, setSelectedAddress] = useState(undefined)
    const [balance, setBalance] = useState(0)

    const connectToMetamask = async () => {
        const provider = new ethers.providers.Web3Provider(
            (window as any).ethereum,
        )
        const accounts = await provider.send('eth_requestAccounts', [])
        const balance = await provider.getBalance(accounts[0])
        setBalance(parseFloat(ethers.utils.formatEther(balance)))
        setSelectedAddress(accounts[0])
    }

    const renderMetamask = () => {
        if (!selectedAddress) {
            return (
                <div>
                    <Button
                        variant="contained"
                        onClick={() => connectToMetamask()}
                    >
                        Connect to Metamask
                    </Button>
                    <hr></hr>
                </div>
            )
        } else {
            return (
                <div>
                    <p>Welcome {selectedAddress}</p>
                    <p>Balance {balance} ETH</p>
                    <hr></hr>
                </div>
            )
        }
    }

    return <div>{renderMetamask()}</div>
}
