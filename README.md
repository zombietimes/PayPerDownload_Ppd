# [PayPerDownload_Ppd](https://github.com/zombietimes/PayPerDownload_Ppd)
This is a sample application of DApps.  

## Overview
[PayPerDownload_Ppd](https://github.com/zombietimes/PayPerDownload_Ppd) allows Pay-Per-Download on the blockchain.  
You can buy digital content on ethereum network.  
[PayPerDownload_Ppd](https://github.com/zombietimes/PayPerDownload_Ppd) is not enough to use, but it is useful for us to learn a blockchain system.  
It is created as a project of Truffle framework.  
It allows accessing to Ganache(Ethereum) and Loom Network.  
It allows accessing through Express server(application server).  
- [DApps : Medium](https://medium.com/swlh/understanding-dapps-decentralized-applications-8f3668ebdc9a)  
- [Truffle : Official](https://truffleframework.com/)  
- [Ganache : Official](https://truffleframework.com/docs/ganache/overview)  
- [Loom Network SDK : Official](https://loomx.io/developers/)  
- [Express : Official](https://expressjs.com/)  
- [web3.js : Official](https://web3js.readthedocs.io/)  
- [socket.io : Official](https://socket.io/index.html)  
- [OpenPGP : Official](https://www.openpgp.org/)  

## Description
Let's run and analyze the sample DApps.  
You can understand deeply by editing the sample code.  
I think that it is worth learning the smart contract development.  
I focus on Ethereum and Loom Network as the DApps.  

### Sample DApps
I created some sample smart contracts below.  
I hope to be useful to you when you develop DApps.  
- [Hello world : HelloZombies.sol](https://github.com/zombietimes/dapp_helloWorld)
- [ERC20 : Coin20.sol](https://github.com/zombietimes/dapp_erc20)
- [ERC721 : Asset721.sol](https://github.com/zombietimes/dapp_erc721)
- [Multi contract : ImportZombies.sol](https://github.com/zombietimes/dapp_multiContract)
- [Sending Ether](https://github.com/zombietimes/dapp_sendEther)
- [Market simulattion : Trade.sol](https://github.com/zombietimes/dapp_trade)
- [Securities : Bill.sol](https://github.com/zombietimes/dapp_bill)
- [noMetamask_Chat : Node.sol](https://github.com/zombietimes/noMetamask_Chat)
- [PayPerDownload_Ppd : Ppd.sol](https://github.com/zombietimes/PayPerDownload_Ppd) : Here!
  
### Environment
truffle + ganache  
express + web3.js + socket.io  
  
## Usage
You press the Payment button, you can buy the digital content.  
![PayPerDownload_Ppd_0000](https://user-images.githubusercontent.com/50263232/83329528-0555fd80-a2c5-11ea-9c73-963bf9f7fcc2.png)  
![PayPerDownload_Ppd_0001](https://user-images.githubusercontent.com/50263232/83329550-1f8fdb80-a2c5-11ea-832d-1da984445ed3.png)  
  
## How it works
### 1) Client-side
At first, it generates a private key and a public key by using OpenPGP.   
And then, when you press the Payment button, it sends the public key and your Ether(1000wei) to the smart contract.  
  
### 2) Smart contract
The smart contract receives the public key and Ether.  
The Ether is the price of the digital content.  
And then, it emits the event to notify the public key to the server-side.  
  
### 3) Server-side
The server program receives the public key.  
It encrypts digital content by using the public key.  
And then, it sends the encrypted digital content to the client-side by using socket.io.  
  
### 4) Client-side
The client program receives encrypted digital content.  
And then, it decrypts by using the private key.  
You can buy digital content.  
  
## Relative link
### Overview
- [Ethereum : Official](https://www.ethereum.org/)
- [Ethereum : Wikipedia](https://en.wikipedia.org/wiki/Ethereum)
- [Loom Network : Official](https://loomx.io/)
- [Loom Network : Binance wiki](https://info.binance.com/en/currencies/loom-network)

### Development
- [Online editor : EthFiddle](https://ethfiddle.com/)
- [Online editor : Remix](https://remix.ethereum.org/)

### Learning
- [Online learning : CryptoZombies](https://cryptozombies.io/)
- [Grammar : Solidity](https://solidity.readthedocs.io/)
- [Grammar : Best Practices](https://github.com/ConsenSys/smart-contract-best-practices)

### DApps
- [DApps : CryptoKitties](https://www.cryptokitties.co/)
- [DApps : Zombie Battle ground](https://loom.games/en/)

## Messages
Do you believe that the decentralized world is coming?  
When do you use [DApps](https://en.wikipedia.org/wiki/Decentralized_application)?  
Why?  

## License
BSD 3-Clause, see `LICENSE` file for details.  

