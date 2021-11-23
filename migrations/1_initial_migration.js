const game = artifacts.require("game");

module.exports = function (deployer) {
  deployer.deploy(game);
};
