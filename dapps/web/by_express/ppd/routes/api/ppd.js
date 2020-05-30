var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', async function(req, res) {
  res.send("Not supported.");
});

// Socket.io
var http = require('http');
var server = http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type':'text/html'});
  res.end('server connected');
});
var io = require('socket.io').listen(server);
server.listen(8000);
io.sockets.on('connection', function (socket) {
  console.log('connected!');
});
function sendEncryptedData(encrypted){
  const data = JSON.stringify({"text":encrypted});
  // console.log(data);
  io.emit('loadData',data);
}

// Web3
const WEB3_GANACHE = function(){
  console.log('<Ganache : web3>');
  const accessUrl = 'http://127.0.0.1:7545';
  const Web3 = require('web3');
  const provider = new Web3.providers.WebsocketProvider(accessUrl);
  this.web3 = new Web3(provider);
}
const WEB3PROVIDER = function(){
  const providerWeb3 = new WEB3_GANACHE();
  this.web3 = providerWeb3.web3;
};
const web3provider = new WEB3PROVIDER();

const ACCESSOR = function(){
};
ACCESSOR.prototype.getPath = function(contractName){
  const pathJson = "/home/zombie/dapps/deploy/by_truffle/build/contracts/" + contractName + ".json"
  return pathJson;
};
WEB3PROVIDER.prototype.getNetworkId = async function(){
  const networkId = await this.web3.eth.net.getId();
  return networkId;
};
WEB3PROVIDER.prototype.getFrom = async function(){
  const accounts = await this.web3.eth.getAccounts();
  return accounts[0];
};
WEB3PROVIDER.prototype.getAccounts = async function(){
  const accounts = await this.web3.eth.getAccounts();
  return accounts;
};
ACCESSOR.prototype.getContractJson = function(contractName){
  const pathJson = this.getPath(contractName);
  const contractJson = require(pathJson);
  return contractJson;
};
ACCESSOR.prototype.GetContract = async function(contractName){
  const contractJson = this.getContractJson(contractName);
  const contractABI = contractJson["abi"];
  const networkId = await web3provider.getNetworkId();
  const from = await web3provider.getFrom();
  const contractAddress = contractJson["networks"][networkId].address;
  const contract = new web3provider.web3.eth.Contract(contractABI,contractAddress,{from});
  return contract;
};
ACCESSOR.prototype.GetAccounts = async function(){
  const accounts = await web3provider.getAccounts();
  return accounts;
}
ACCESSOR.prototype.GetWeb3 = async function(){
  return web3provider.web3;
}
async function watchEvent(){
  const accessor = new ACCESSOR();
  const contractName = "Ppd";
  const instance = await accessor.GetContract(contractName);
  instance.events.Payment({},function(error,event){ /* console.log(event); */ })
  .on('data', async function(event){
    const publicKeyPgp = event.returnValues.publicKeyPgp;
    const encrypted = await ZTIMES.SELLER.GetMessage(publicKeyPgp);
    sendEncryptedData(encrypted);
  })
  .on('error', console.error);
}
watchEvent();

// PGP
const openpgp = require('openpgp');
var ZTIMES = ZTIMES || {};
ZTIMES.PGP = {
  GenerateKey: async function(params){
    const key = await openpgp.generateKey({
        userIds: [{name:params.name,email:params.email}],
        rsaBits: 4096,
        passphrase: params.passphrase
    });
    return key;
  },
  ShowKey: function(key){
    console.log("privateKeyArmored");
    console.log(key.privateKeyArmored);
    console.log("publicKeyArmored");
    console.log(key.publicKeyArmored);
    console.log("revocationCertificate");
    console.log(key.revocationCertificate);
  },
  GetPrivateKey: async function(params){
    const { keys: [privateKey] } = await openpgp.key.readArmored(params.privateKeyArmored);
    await privateKey.decrypt(params.passphrase)
    return privateKey;
  },
  Encrypt: async function(params){
    const { data: encrypted } = await openpgp.encrypt({
        message: openpgp.message.fromText(params.message),
        publicKeys: (await openpgp.key.readArmored(params.publicKeyArmored)).keys
    });
    return encrypted;
  },
  Decrypt: async function(params){
    const { data: decrypted } = await openpgp.decrypt({
        message: await openpgp.message.readArmored(params.encrypted),
        privateKeys: [params.privateKey]
    });
    return decrypted;
  },
};
ZTIMES.SELLER = {
  message: "I am a zombie.",
  GetMessage: async function(publicKeyArmored){
    const encrypted = await ZTIMES.PGP.Encrypt({
        message: this.message,
        publicKeyArmored: publicKeyArmored
    });
    return encrypted;
  },
};

module.exports = router;
