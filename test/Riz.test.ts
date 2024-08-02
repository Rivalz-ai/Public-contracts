import { ethers } from 'hardhat'
import { expect } from 'chai'
import { RivalzToken } from '../typechain'

describe('Rivalz Token deploy', function () {
  it('mint and burn', async function () {
    const [deployer] = await ethers.getSigners()
    const Riz = await ethers.getContractFactory('RivalzToken')
    const riz: RivalzToken = await Riz.deploy(deployer.address)

    const decimals = await riz.decimals()
    expect(decimals).to.be.equal(18)
    const maxSupply = ethers.utils.parseUnits('5000000000', decimals)
    const maxSupplyOnContract = await riz.MAX_SUPPLY()
    expect(maxSupplyOnContract.toBigInt()).to.be.equal(maxSupply.toBigInt())
    const balanceBefore = await riz.balanceOf(deployer.address)
    expect(balanceBefore.toBigInt()).to.be.equal(maxSupply.toBigInt())

    //burn
    const burnAmount = ethers.utils.parseUnits('10', 6)
    await riz.burn(burnAmount)
    const balanceAfter = await riz.balanceOf(deployer.address)
    expect(balanceAfter.toBigInt()).to.be.equal(balanceBefore.toBigInt() - burnAmount.toBigInt())
  })
})
