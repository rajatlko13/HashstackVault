// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC4626Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

/**
 * @title TokenizedVault
 * @dev A contract representing a tokenized vault with investment strategies.
 * Allows the owner to deposit assets, set investment limits, and manage the investment strategy.
 */
contract TokenizedVault is ERC4626Upgradeable, OwnableUpgradeable {
    uint256 public totalDepositedAsset;

    uint256 public maxSpendPerc;

    address public strategy;

    error InvalidLimit();
    error ZeroAddress();
    error MaxSpendLimitReached();
    error InvestFailed();

    /**
     * @dev Initializes the TokenizedVault contract.
     * @param asset_ The underlying ERC20 asset.
     * @param maxSpendPerc_ The maximum percentage of total assets that can be spent on investment.
     * @param strategy_ The address of the investment strategy contract.
     */
    function __TokenizedVault_init(
        IERC20 asset_,
        uint256 maxSpendPerc_,
        address strategy_
    ) public initializer {
        if (maxSpendPerc_ > 70) revert InvalidLimit();

        if (strategy_ == address(0)) revert ZeroAddress();

        maxSpendPerc = maxSpendPerc_;
        strategy = strategy_;
        __ERC4626_init(asset_);
        __Ownable_init(msg.sender);
    }

    /**
     * @dev Updates the investment strategy.
     * @param _strategy The new address of the investment strategy contract.
     */
    function updateStrategy(address _strategy) external onlyOwner {
        if (_strategy == address(0)) revert ZeroAddress();

        strategy = _strategy;
    }

    /**
     * @dev Checks for maximum spend limit and then invests in the strategy contract.
     * @param _amount The amount of assets to invest.
     * @param _calldata The calldata to be used for the investment strategy function call.
     */
    function invest(
        uint256 _amount,
        bytes memory _calldata
    ) external onlyOwner {
        if (
            (totalAssets() - _amount) <
            ((100 - maxSpendPerc) * totalDepositedAsset) / 100
        ) revert MaxSpendLimitReached();

        // approve the strategy
        IERC20(asset()).approve(strategy, _amount);
        // invest fund in strategy
        (bool success, ) = strategy.call(_calldata);
        if (!success) revert InvestFailed();
    }

    /**
     * @dev Calculates the available funds that can be invested in the strategy contract.
     * @return The amount of funds available for investment.
     */
    function reserveFundAvailable() public view returns (uint256) {
        return ((maxSpendPerc * totalDepositedAsset) / 100) - totalAssets();
    }

    function _deposit(
        address caller,
        address receiver,
        uint256 assets,
        uint256 shares
    ) internal override {
        totalDepositedAsset += assets;
        return super._deposit(caller, receiver, assets, shares);
    }

    function _withdraw(
        address caller,
        address receiver,
        address owner,
        uint256 assets,
        uint256 shares
    ) internal override {
        totalDepositedAsset -= assets;
        return super._withdraw(caller, receiver, owner, assets, shares);
    }
}
