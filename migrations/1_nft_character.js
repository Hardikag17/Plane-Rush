const NFTCharacter = artifacts.require("NFTCharacter");

module.exports = async (deployer) => {
  await deployer.deploy(NFTCharacter);
  let nftCharacter = await NFTCharacter.deployed();
};
