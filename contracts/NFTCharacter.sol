// SPDX-License-Identifier: MIT
pragma solidity ^0.6.6;

import "@chainlink/contracts/src/v0.6/ChainlinkClient.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFTCharacter is ERC721, ChainlinkClient {
  address public contractOwner;

  address private oracle;
  bytes32 private jobId;
  uint256 private fee;

  constructor() public ERC721("NFTCharacter", "NTC") {
    setChainlinkToken(0x326C977E6efc84E512bB9C30f76E30c160eD06FB);

    contractOwner = msg.sender;

    oracle = 0xc8D925525CA8759812d0c299B90247917d4d4b7C;
    jobId = "a7330d0b4b964c05abc66a26307047c0";
    fee = 0.01 * 10**18;
  }

  modifier onlyContractOwner() {
    require(
      msg.sender == contractOwner,
      "The caller should be the owner of this contract"
    );
    _;
  }

  function setOracleAddress(address _oracleAddress) public onlyContractOwner {
    oracle = _oracleAddress;
  }

  function setJobID(string memory _jobID) public onlyContractOwner {
    jobId = stringToBytes32(_jobID);
  }

  function setFeeInLink(uint256 _fee) public onlyContractOwner {
    fee = _fee * 10**18;
  }

  function stringToBytes32(string memory source)
    internal
    pure
    returns (bytes32 result)
  {
    bytes memory tempEmptyStringTest = bytes(source);
    if (tempEmptyStringTest.length == 0) {
      return 0x0;
    }
    assembly {
      result := mload(add(source, 32))
    }
  }
}
