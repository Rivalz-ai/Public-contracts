// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RivalzToken is ERC20, ERC20Burnable, Ownable {
    uint256 public constant MAX_SUPPLY = 5_000_000_000 * 10 ** 18;

    error MaxSupplyExceed();

    constructor(address initialOwner) ERC20("RivalzToken", "$RIZ") Ownable(initialOwner) {}

    function mint(address to, uint256 amount) public onlyOwner {
        if (totalSupply() + amount > MAX_SUPPLY) revert MaxSupplyExceed();
        _mint(to, amount);
    }
}
