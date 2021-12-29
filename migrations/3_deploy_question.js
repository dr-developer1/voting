const Question = artifacts.require("./newElection.sol");

module.exports = function (deployer) {
  deployer.deploy(Question);
};
