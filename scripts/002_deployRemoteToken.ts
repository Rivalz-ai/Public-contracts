import { EvmChain } from '@axelar-network/axelarjs-sdk'
import { deployRemoteCanonicalToken } from './utils'

//change this for mainnet
const fromChain = EvmChain.SEPOLIA
const toChain = EvmChain.ARBITRUM_SEPOLIA

deployRemoteCanonicalToken(fromChain, toChain).catch((error) => {
  console.error(error)
  process.exitCode = 1
})
