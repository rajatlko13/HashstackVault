# Hashstack Vault

### Contracts -
1. Token contract
2. Strategy contract
3. TokenizedVault contract

### Usage

#### Install 

```shell
npm install
```


#### Compile

```shell
npx hardhat compile
```

#### Test

```shell
npx hardhat test
```

#### Deploy

Create .env file similar to .env.example file, defining the following variable - 
```
POLYGON_MUMBAI_RPC_URL=
POLYGONSCAN_API_KEY=
PRIVATE_KEY=
```
Then run this command -
```shell
npx hardhat run scripts/deployVault.ts --network mumbai
```
### Deployed contracts
These contract are deployed on Polygon Mumbai network -
- Token - [0xC984c996a70205Ae361C16070ca3d44B42f37fE2](https://mumbai.polygonscan.com/address/0xc984c996a70205ae361c16070ca3d44b42f37fe2 "0xC984c996a70205Ae361C16070ca3d44B42f37fE2")
- Strategy - [0x64173cf40673555596Ceabf527cb9300d8e3dED8](https://mumbai.polygonscan.com/address/0x64173cf40673555596ceabf527cb9300d8e3ded8 "0x64173cf40673555596Ceabf527cb9300d8e3dED8")
- TokenizedVault - [0x7F4B3121b1fD700483c8779e735c2a97d0C38513](https://mumbai.polygonscan.com/address/0x7f4b3121b1fd700483c8779e735c2a97d0c38513 "0x7F4B3121b1fD700483c8779e735c2a97d0C38513")


