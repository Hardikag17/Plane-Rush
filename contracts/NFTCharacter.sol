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
    setChainlinkToken(0x326C977E6efc84E512bB9C30f76E30c160eD06FB); // Chainlink token address in Polygon Mumbai testnet

    contractOwner = msg.sender;

    oracle = 0xc8D925525CA8759812d0c299B90247917d4d4b7C;
    jobId = "a7330d0b4b964c05abc66a26307047c0";
    fee = 0.01 * 10**18;
    uniqueTokenId = 0;
  }

  event CharacterBought(uint256 tokenId);

  event CharacterUpForSale(uint256 tokenId);

  modifier onlyContractOwner() {
    require(
      msg.sender == contractOwner,
      "The caller should be the owner of this contract"
    );
    _;
  }

  bytes32 private ipfsHashOneBytes32;
  bytes32 private ipfsHashTwoBytes32;

  string public ipfsLink = "ipfs://";

  uint256 private uniqueTokenId = 0;

  address[] private users;

  function setOracleAddress(address _oracleAddress) public onlyContractOwner {
    oracle = _oracleAddress;
  }

  function setJobID(string memory _jobID) public onlyContractOwner {
    jobId = stringToBytes32(_jobID);
  }

  function setFeeInLink(uint256 _fee) public onlyContractOwner {
    fee = _fee * 10**18;
  }

  string private apiBaseUrl =
    "https://randomize-character.herokuapp.com/first/";
  string private apiSecondUrl =
    "https://randomize-character.herokuapp.com/second/";

  function getUsers() public view returns (address[] memory) {
    return users;
  }

  function setApiBaseUrl(string memory _url) public onlyContractOwner {
    apiBaseUrl = _url;
  }

  function setApiSecondUrl(string memory _url) public onlyContractOwner {
    apiSecondUrl = _url;
  }

  event NewCharacterGenerated(uint256 tokenId);

  event DataReceivedFromAPI(string ipfsLink);

  mapping(uint256 => uint256) public charactersForSale;

  mapping(address => string) public userAddressToHighScore;

  function putUpCharacterForSale(uint256 _tokenId, uint256 _price) public {
    require(
      _isApprovedOrOwner(_msgSender(), _tokenId),
      "ERC721: Caller is not owner nor approved"
    );
    charactersForSale[_tokenId] = _price;

    emit CharacterUpForSale(_tokenId);
  }

  function buyCharacter(uint256 _tokenId) public payable {
    require(
      charactersForSale[_tokenId] > 0,
      "The character should be up for sale"
    );

    uint256 characterCost = charactersForSale[_tokenId];
    charactersForSale[_tokenId] = 0;

    address ownerAddress = ownerOf(_tokenId);
    require(msg.value > characterCost, "You need to have enough Ether");

    _safeTransfer(ownerAddress, msg.sender, _tokenId, bytes("Buy a character"));

    address payable ownerAddressPayable = payable(ownerAddress);
    ownerAddressPayable.transfer(characterCost);
    if (msg.value > characterCost) {
      payable(msg.sender).transfer(msg.value - characterCost);
    }

    emit CharacterBought(_tokenId);
  }

  function setHighScore(string memory _highScore, address _sender) internal {
    bytes memory score = bytes(userAddressToHighScore[_sender]);
    if (score.length == 0) {
      users.push(_sender);
    }
    userAddressToHighScore[_sender] = _highScore;
  }

  function requestIPFSHash(string memory apiLink)
    private
    returns (bytes32 requestId)
  {
    Chainlink.Request memory request = buildChainlinkRequest(
      jobId,
      address(this),
      this.fulfillFirstRequest.selector
    );
    request.add("get", apiLink);
    request.add("path", "IPFS_PATH");

    return sendChainlinkRequestTo(oracle, request, fee);
  }

  function requestNewRandomCharacter(string memory score) public {
    setHighScore(score, msg.sender);
    ipfsLink = "ipfs://";
    _safeMint(msg.sender, uniqueTokenId++);
    string memory apiLink = append(apiBaseUrl, "?score=", score);
    string memory characterId = uint2str(totalSupply());
    apiLink = append(apiLink, "&characterId=", characterId);
    requestIPFSHash(apiLink);
  }

  function fulfillFirstRequest(bytes32 _requestId, bytes32 dataFromAPI)
    public
    recordChainlinkFulfillment(_requestId)
    returns (bytes32 requestId)
  {
    ipfsHashOneBytes32 = dataFromAPI;

    Chainlink.Request memory request = buildChainlinkRequest(
      jobId,
      address(this),
      this.fulfillSecondRequest.selector
    );
    request.add("get", apiSecondUrl);
    request.add("path", "IPFS_PATH");

    return sendChainlinkRequestTo(oracle, request, fee);
  }

  function fulfillSecondRequest(bytes32 _requestId, bytes32 dataFromAPI)
    public
    recordChainlinkFulfillment(_requestId)
  {
    ipfsHashTwoBytes32 = dataFromAPI;
    generateIPFSLink();

    emit DataReceivedFromAPI(ipfsLink);

    setTokenURI(ipfsLink);

    emit NewCharacterGenerated(uniqueTokenId - 1);
  }

  function setTokenURI(string memory _tokenURI) private {
    uint256 lastTokenId = totalSupply() - 1;
    _setTokenURI(lastTokenId, _tokenURI);
  }

  function updateTokenURI(uint256 _tokenId, string memory _tokenURI)
    public
    onlyContractOwner
  {
    _setTokenURI(_tokenId, _tokenURI);
  }

  function uint2str(uint256 _i)
    internal
    pure
    returns (string memory _uintAsString)
  {
    if (_i == 0) {
      return "0";
    }
    uint256 j = _i;
    uint256 len;
    while (j != 0) {
      len++;
      j /= 10;
    }
    bytes memory bstr = new bytes(len);
    uint256 k = len;
    while (_i != 0) {
      k = k - 1;
      uint8 temp = (48 + uint8(_i - (_i / 10) * 10));
      bytes1 b1 = bytes1(temp);
      bstr[k] = b1;
      _i /= 10;
    }
    return string(bstr);
  }

  function append(
    string memory a,
    string memory b,
    string memory c
  ) internal pure returns (string memory) {
    return string(abi.encodePacked(a, b, c));
  }

  function generateIPFSLink() private {
    string memory ipfsHashPartOne = bytes32ToString(ipfsHashOneBytes32);
    string memory ipfsHashPartTwo = bytes32ToString(ipfsHashTwoBytes32);
    ipfsLink = append(ipfsLink, ipfsHashPartOne, ipfsHashPartTwo);
    ipfsLink = append(ipfsLink, "/metadata", ".json");
  }

  function bytes32ToString(bytes32 _bytes32)
    internal
    pure
    returns (string memory)
  {
    uint8 i = 0;
    while (i < 32 && _bytes32[i] != 0) {
      i++;
    }
    bytes memory bytesArray = new bytes(i);
    for (i = 0; i < 32 && _bytes32[i] != 0; i++) {
      bytesArray[i] = _bytes32[i];
    }
    return string(bytesArray);
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
