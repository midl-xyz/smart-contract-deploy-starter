// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TERC20 is ERC20 {
    error WrongAccess();

    address public minter;

    constructor() ERC20("TERC20", "TERC20") {
        minter = msg.sender;
        _mint(msg.sender, 1_000_000 * (10 ** 18));
    }
}
