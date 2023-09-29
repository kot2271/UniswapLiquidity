// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract PizzaToken is ERC20 {
    address public owner;

  constructor() ERC20("PizzaToken", "PiToken") {
        decimals();
        owner = msg.sender;
        _mint(msg.sender, 10 ether);
  }

  function mint(address to, uint256 amount) public {
    require(msg.sender == owner, "PizzaToken: you are not an owner");
    _mint(to, amount);
  }
}