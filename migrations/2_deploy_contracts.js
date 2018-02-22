var DailyToken = artifacts.require("./DailyToken.sol");

module.exports = function(deployer) {
  deployer.deploy(DailyToken, 10000000, '0x3905692887231e5672dacb49c0a32b87f7de81a8');
};
