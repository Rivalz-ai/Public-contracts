import { abis as itcTokenServiceAbis } from '../abis/interchainTokenService'
import { abis as itcTokenFactoryAbis } from '../abis/interchainTokenFactory'
import { ethers } from 'hardhat'
import { AxelarQueryAPI, Environment, EvmChain } from '@axelar-network/axelarjs-sdk'
import { ContractInterface } from 'ethers'

const interchainTokenServiceContractABI = itcTokenServiceAbis
const interchainTokenFactoryContractABI = itcTokenFactoryAbis

const interchainTokenServiceContractAddress = '0xB5FB4BE02232B1bBA4dC8f81dc24C26980dE9e3C'
const interchainTokenFactoryContractAddress = '0x83a93500d23Fbc3e82B410aD07A6a9F7A0670D66'

const environment = process.env.MODE == 'Mainnet' ? Environment.MAINNET : Environment.TESTNET
const api = new AxelarQueryAPI({ environment })
const rizAddress = process.env.RIZ_ADDRESS
const tokenId = process.env.RIZ_TOKEN_ID
async function getSigner() {
  const [signer] = await ethers.getSigners()
  return signer
}

async function getContractInstance(
  contractAddress: string,
  contractABI: ContractInterface,
  signer: any
) {
  return new ethers.Contract(contractAddress, contractABI, signer)
}

// Estimate gas costs.
export async function gasEstimator(from: EvmChain, to: EvmChain, gasLimit: number = 7000000) {
  console.log({ gasLimit })
  const gas = await api.estimateGasFee(from, to, gasLimit, 1.2)
  console.log({ gas })
  return gas
}

export async function registerCanonicalToken() {
  const signer = await getSigner()
  console.log('signer', signer.address)
  const interchainTokenFactoryContract = await getContractInstance(
    interchainTokenFactoryContractAddress,
    interchainTokenFactoryContractABI,
    signer
  )
  const deployTxData = await interchainTokenFactoryContract.registerCanonicalInterchainToken(
    rizAddress
  )
  const tx = await ethers.provider.getTransactionReceipt(deployTxData.hash)
  const log = tx?.logs[0] as any
  console.log(
    `
    Transaction Hash: ${deployTxData.hash},
    Token Id: ${log.args[1]}
    `
  )
}

export async function deployRemoteCanonicalToken(fromChain: EvmChain, toChainName: EvmChain) {
  const signer = await getSigner()

  const interchainTokenFactoryContract = await getContractInstance(
    interchainTokenFactoryContractAddress,
    interchainTokenFactoryContractABI,
    signer
  )
  const gas = await gasEstimator(fromChain, toChainName)
  const deployTxData = await interchainTokenFactoryContract.deployRemoteCanonicalInterchainToken(
    fromChain,
    rizAddress,
    toChainName,
    gas,
    { value: gas }
  )

  console.log(
    `
    Transaction Hash: ${deployTxData.hash},
    `
  )
}

export async function transferByTokenService(
  fromChain: EvmChain,
  toChain: EvmChain,
  receipient: string,
  sendAmount: string
) {
  const signer = await getSigner()
  console.log('signer', signer.address)
  const interchainTokenServiceContract = await getContractInstance(
    interchainTokenServiceContractAddress,
    interchainTokenServiceContractABI,
    signer
  )
  const gas = await gasEstimator(fromChain, toChain)
  console.log('data', {
    tokenId,
    desChain: toChain,
    receipient,
    sendAmount,
    metadata: '0x',
    gas
  })

  const sendTx = await interchainTokenServiceContract.interchainTransfer(
    tokenId,
    toChain,
    receipient,
    sendAmount,
    '0x',
    gas,
    { value: gas }
  )
  await sendTx.wait()

  console.log(`transaction hash: ${sendTx.hash}`)
}

export async function getTokenId() {
  const signer = await getSigner()
  console.log('signer', signer.address)
  const interchainTokenFactoryContract = await getContractInstance(
    interchainTokenFactoryContractAddress,
    interchainTokenFactoryContractABI,
    signer
  )
  const rizTokenId = await interchainTokenFactoryContract.canonicalInterchainTokenId(rizAddress)
  console.log({ rizTokenId })
}
