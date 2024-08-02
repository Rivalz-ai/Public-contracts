import { EvmChain, GasToken } from '@axelar-network/axelarjs-sdk'
import { transferByTokenService } from './utils'
import { ethers } from 'hardhat'

// change this for destination chain
const toChain = EvmChain.ARBITRUM_SEPOLIA
const receipient = '0x8b736035BbDA71825e0219f5FE4DfB22C35FbDDC'
const amount = ethers.utils.parseEther('5') // 1ether for testing
transferByTokenService(EvmChain.SEPOLIA, toChain, receipient, amount.toString()).catch((error) => {
  console.error(error)
  process.exitCode = 1
})
