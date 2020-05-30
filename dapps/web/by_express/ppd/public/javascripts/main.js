// Web3
const WEB3_GANACHE = function(){
  console.log('<Ganache : web3>');
  const accessUrl = 'http://127.0.0.1:7545';
  const provider = new Web3.providers.HttpProvider(accessUrl);
  this.web3 = new Web3(provider);
}
const WEB3PROVIDER = function(){
  const providerWeb3 = new WEB3_GANACHE();
  this.web3 = providerWeb3.web3;
};
WEB3PROVIDER.prototype.getNetworkId = async function(){
  const networkId = await this.web3.eth.net.getId();
  return networkId;
};
WEB3PROVIDER.prototype.getAccounts = async function(){
  const accounts = await this.web3.eth.getAccounts();
  return accounts;
};
const web3provider = new WEB3PROVIDER();

const ACCESSOR = function(){
};
ACCESSOR.prototype.getPath = function(contractName){
  const pathJson = "/home/zombie/dapps/web/by_express/ppd/public/javascripts/abiJson_" + contractName + ".js"
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
  return AbiJson;
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

var ZTIMES = ZTIMES || {};
ZTIMES.SOCKETIO = {
  socket: null,
  emit: null,
  init: function(){
    this.socket = io.connect("http://localhost:8000");
    this.emit = function(name,data){
      this.socket.emit(name,JSON.stringify(data));
    }
  },
  Send: function(key,value){
    this.emit(key,{text:value});
  },
  Recv: function(key,act){
    this.socket.on(key,act);
  },
};
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
ZTIMES.BUYER = {
  init: async function(){
    this.textArea = document.getElementById("iText");
    document.getElementById("iBtnPayment").addEventListener('mouseup',async function(){
      await ZTIMES.BUYER.payment();
      await ZTIMES.BUYER.load();
      console.log("Done.");
    },false);
    this.params = {name:"BUYER",email:"BUYER@gmail.com",passphrase:"I am BUYER."};
    this.key = await ZTIMES.PGP.GenerateKey(this.params);
    this.publicKeyArmored = this.key.publicKeyArmored;
    ZTIMES.SOCKETIO.Recv("loadData",function(d){
        var data = JSON.parse(d);
        const encrypted = data.text;
        ZTIMES.BUYER.load(encrypted);
        console.log("Received.");
    });
    console.log("Ready.");
  },
  payment: async function(){
    const publicKeyPgp = ZTIMES.BUYER.publicKeyArmored;
    const accessor = new ACCESSOR();
    const contractName = "Ppd";
    const instance = await accessor.GetContract(contractName);
    const accounts = await accessor.GetAccounts();
    await instance.methods.BuyDigital(publicKeyPgp).send({
      from: accounts[0],
      value: 1000,
      gas: 4712388,
      gasPrice: 100000000000
    });
  },
  load: async function(encrypted){
    const privateKeyArmored = this.key.privateKeyArmored;
    const privateKey = await ZTIMES.PGP.GetPrivateKey(
      {privateKeyArmored:privateKeyArmored,passphrase:this.params.passphrase}
    );
    const decrypted = await ZTIMES.PGP.Decrypt(
      {encrypted:encrypted,privateKey:privateKey}
    );
    this.textArea.value = decrypted;
  },
};
ZTIMES.RUN = {
  init: function(){
    ZTIMES.SOCKETIO.init();
    ZTIMES.BUYER.init();
  },
};
ZTIMES.RUN.init();

//
