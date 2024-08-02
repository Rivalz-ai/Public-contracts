# Contracts

1. compile and deploy contract
   1.1. Copy and fill enviroment variable in .env file

```shell
    cp .env.example .env
```

    1.2. Then compile and deploy

```shell
    yarn compile

    yarn deploy --network [network]
```

    1.3. After deployed token: get riz token address in console and fill to 'RIZ_ADDRESS' variable in .env file

2. Register Riz token in interchain

```shell
    yarn register --network [network]
```

After register token: get tokenId show on console, if you don't see it, please find log in block explore then fill it in 'RIZ_TOKEN_ID' .env file 3. Deploy remote token to destination chain

- change parameter in scripts/002_deployRemoteToken.ts

```shell
    yarn deployRemoteToken --network [network]
```

4. send test 1ether to recepient

- change parameters in scripts/003_transferToken.ts
- make sure that sender have enough riz balance and approve for interchain token service: 0xB5FB4BE02232B1bBA4dC8f81dc24C26980dE9e3C

```shell
    yarn transferToken --network [network]
```
