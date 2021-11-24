// SPDX-License-Identifier: MIT
pragma solidity ^0.6.6;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFTCharacter is ERC721 {
  address public contractOwner;

  constructor() public ERC721("NFTCharacter", "NTC") {
    contractOwner = msg.sender;
  }

  modifier onlyContractOwner() {
    require(
      msg.sender == contractOwner,
      "The caller should be the owner of this contract"
    );
    _;
  }
}
