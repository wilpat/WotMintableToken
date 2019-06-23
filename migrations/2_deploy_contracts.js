const WotToken = artifacts.require("WotToken");

module.exports = function(deployer) {
  deployer.deploy(WotToken, 1000000)// passed as argument into the constructor of the WoToken smart contract
};
