# WotMintableToken
This project attempts to solve the challenge given by [timi](https://twitter.com/timigod)

# Installation:
## Clone the repo

## Pull in dependencies
  Use yarn or npm for this.
## Set up credentials
I used infura to deployed this smart contract to the rinkeby test net and I've made it availabe here. Nevertheless, you can use yours by editing the `.infura_rinkeby_endpoint` file
  - Replace the contents of `.secret` with your mnemonic to connect to your rinkeby wallet
  
## Deploy
Run `truffle migrate --compile-all --reset --network rinkeby` to deploy this contract

## Serve to your browser
run `npm run dev` to start up the application
