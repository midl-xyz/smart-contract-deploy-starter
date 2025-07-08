// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CollateralERC20 is ERC20 {
    error WrongAccess();

    address public minter;

    constructor(
        string memory name,
        string memory symbol,
        uint256 supply
    ) ERC20(name, symbol) {
        minter = msg.sender;
        _mint(msg.sender, supply * (10 ** 18));
    }

    modifier onlyMinter() {
        if (msg.sender != minter) {
            revert WrongAccess();
        }
        _;
    }

    function setMinter(address minter_) external onlyMinter {
        minter = minter_;
    }

    function mint(address account, uint256 amount) external onlyMinter {
        _mint(account, amount);
    }

    function burnFrom(address account, uint256 amount) external onlyMinter {
        _burn(account, amount);
    }
}
