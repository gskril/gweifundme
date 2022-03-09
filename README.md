# Gwei Fund Me

[Buy Me a Coffee](https://www.buymeacoffee.com/) but with Ethereum.

## How it works
Every Ethereum address and ENS name has its own page at gweifund.me/{address}.

A message is attached to each transaction which allows us to query that data from the blockchain (see Dune Analytics below), avoiding the need for a database to track past transactions. This is also used to show previous transactions made by each user on the website (see [gweifund.me/gregskril.eth](https://gweifund.me/gregskril.eth) for example).

There are no fees on any transaction, no messages to sign, and no smart contracts involved.

## Stack
- Express and EJS for templating
- [Ethers](https://docs.ethers.io/v5/) for MetaMask wallet interactions
- [ENS Ideas](https://ensideas.com/about) for quick resolving of ENS names
- [Dune Analytics](https://dune.xyz/gregskril/gweifundme) for a dashboard of all on-chain transactions

## Run locally
1. Install dependencies with `npm install`
2. Start with `npm start`
3. Open [localhost:3000](http://localhost:3000/) in your browser

