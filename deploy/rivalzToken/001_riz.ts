import { HardhatRuntimeEnvironment } from 'hardhat/types'

module.exports = async ({ getNamedAccounts, deployments }: HardhatRuntimeEnvironment) => {
  const { deployer } = await getNamedAccounts()
  console.log('deployed by:', deployer)

  const { deploy } = deployments
  const riz = await deploy('RivalzToken', {
    from: deployer,
    args: [deployer],
    contract: 'RivalzToken',
    log: true
  })
  console.log('deployed success', riz.address)
}
