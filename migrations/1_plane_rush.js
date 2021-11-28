const PlaneRush = artifacts.require("PlaneRush");

module.exports = async (deployer) => {
  await deployer.deploy(PlaneRush);
  let planeRush = await PlaneRush.deployed();
};
