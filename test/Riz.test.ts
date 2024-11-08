import { ethers } from 'hardhat'
import { expect } from 'chai'
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers"
import { RivalzToken } from '../typechain'
import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers'

describe('RivalzToken', function () {
  let riz: RivalzToken
  let owner: SignerWithAddress
  let user1: SignerWithAddress
  let user2: SignerWithAddress

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners()
    const Riz = await ethers.getContractFactory('RivalzToken')
    riz = await Riz.deploy(owner.address)
  })

  describe('Deployment', function () {
    it('should set the correct token name and symbol', async function () {
      expect(await riz.name()).to.equal('RivalzToken')
      expect(await riz.symbol()).to.equal('$RIZ')
    })

    it('should set the correct decimals', async function () {
      expect(await riz.decimals()).to.equal(18)
    })

    it('should set the correct MAX_SUPPLY', async function () {
      const maxSupply = ethers.parseUnits('5000000000', 18)
      expect(await riz.MAX_SUPPLY()).to.equal(maxSupply)
    })

    it('should mint initial supply to owner', async function () {
      const maxSupply = ethers.parseUnits('5000000000', 18)
      expect(await riz.balanceOf(owner.address)).to.equal(maxSupply)
    })
  })

  describe('ERC20 functionality', function () {
    const transferAmount = ethers.parseUnits('1000', 18)

    it('should allow transfers between accounts', async function () {
      await riz.transfer(user1.address, transferAmount)
      expect(await riz.balanceOf(user1.address)).to.equal(transferAmount)
    })

    it('should allow approve and transferFrom', async function () {
      await riz.approve(user1.address, transferAmount)
      expect(await riz.allowance(owner.address, user1.address)).to.equal(transferAmount)
      
      await riz.connect(user1).transferFrom(owner.address, user2.address, transferAmount)
      expect(await riz.balanceOf(user2.address)).to.equal(transferAmount)
    })
  })

  describe('Burning functionality', function () {
    const burnAmount = ethers.parseUnits('1000', 18)

    it('should allow token holder to burn their tokens', async function () {
      const initialBalance = await riz.balanceOf(owner.address)
      await riz.burn(burnAmount)
      expect(await riz.balanceOf(owner.address)).to.equal(initialBalance - burnAmount)
    })

    it('should allow approved spender to burnFrom', async function () {
      await riz.approve(user1.address, burnAmount)
      const initialBalance = await riz.balanceOf(owner.address)
      await riz.connect(user1).burnFrom(owner.address, burnAmount)
      expect(await riz.balanceOf(owner.address)).to.equal(initialBalance - burnAmount)
    })
  })

  describe('Ownership', function () {
    it('should set the correct owner', async function () {
      expect(await riz.owner()).to.equal(owner.address)
    })

    it('should allow ownership transfer', async function () {
      await riz.transferOwnership(user1.address)
      expect(await riz.owner()).to.equal(user1.address)
    })

    it('should prevent non-owners from transferring ownership', async function () {
      await expect(
        riz.connect(user1).transferOwnership(user2.address)
      ).to.be.revertedWithCustomError(riz, 'OwnableUnauthorizedAccount')
    })
  })
})
