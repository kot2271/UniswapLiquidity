// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract AddLiquidity {

  IUniswapV2Router02 public immutable router = IUniswapV2Router02(0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D);

  IUniswapV2Factory public immutable factory = IUniswapV2Factory(0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f);

  event Log(string message, uint val);

  event AddedLiquidity(
    address indexed tokenA,
    address indexed tokenB,
    address creator,
    address lpPair
  );

  function addLiquidity(
    address _tokenA, 
    address _tokenB, 
    uint256 _amountA, 
    uint256 _amountB
  ) external {

    /**
     * address(this) обозначает адрес самого смарт-контракта, который временно хранит токены до их отправки в Uniswap.
     * Таким образом, происходит передача токенов amountA от отправителя msg.sender (лица, вызывающего контракт) на адрес контракта.
     * 
     * Ключевая причина передачи на контракт, а не напрямую на router Uniswap, заключается в безопасности. Передача сначала контракту позволяет избежать перехвата токенов в случае возникновения проблем при взаимодействии с Uniswap.
     * 
     * Поток выглядит следующим образом:
     * Пользователь вызывает addLiquidity и дает согласие на перевод токенов amountA и amountB. Контракт переводит эти токены себе.
     * Затем контракт дает разрешение роутеру Uniswap на расходование токенов amountA и amountB
     * Router вызывает Uniswap для добавления ликвидности
     * Новые токены Uniswap LP отправляются пользователю.
     */

    IERC20(_tokenA).transferFrom(msg.sender, address(this), _amountA);
    IERC20(_tokenB).transferFrom(msg.sender, address(this), _amountB);

    IERC20(_tokenA).approve(address(router), _amountA);
    IERC20(_tokenB).approve(address(router), _amountB);

      (uint amountA, uint amountB, uint liquidity) = router.addLiquidity(
        _tokenA,
        _tokenB,
        _amountA,
        _amountB,
        1,
        1,
        msg.sender,
        block.timestamp + 10000
      );

    address pair = factory.getPair(_tokenA, _tokenB);

    emit Log("liquidity: ", liquidity);

    if (amountA < _amountA) {
          IERC20(_tokenA).transfer(msg.sender, _amountA - amountA);
        }

    if (amountB < _amountB) {
          IERC20(_tokenB).transfer(msg.sender, _amountB - amountB);
        }

    emit AddedLiquidity(_tokenA, _tokenB, msg.sender, pair);
  }
}