// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Strategy {

    event VaultInvest();

    function depositFromVault(IERC20 token, uint256 value) public {
        bool success = IERC20(token).transferFrom(msg.sender, address(this), value);
        require(success, "Transfer from Vault Failed");
        emit VaultInvest();
    }

}