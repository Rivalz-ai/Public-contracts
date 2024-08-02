import { EvmChain } from '@axelar-network/axelarjs-sdk'
import { transferByTokenService } from './utils'
import { ethers } from 'hardhat'

// change this for destination chain
const toChain = EvmChain.ARBITRUM_SEPOLIA
const receipient = '0x'
const amount = ethers.utils.parseEther('1') // 1ether for testing
transferByTokenService(EvmChain.SEPOLIA, toChain, receipient, amount.toString()).catch((error) => {
  console.error(error)
  process.exitCode = 1
})
