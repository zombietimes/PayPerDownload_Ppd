const sol = artifacts.require("./Ppd.sol");
module.exports = function(deployer) {
  deployer.deploy(sol);
};
