import { BigInt } from "@graphprotocol/graph-ts"
import { AnswerUpdated } from '../generated/ChainlinkAggregatorETH/ChainlinkAggregator'
import { AddLiquidity, RemoveLiquidity } from "../generated/GlpManager/GlpManager"
import { Swap } from '../generated/UniswapPool/UniswapPoolV3'
import { BI_10, getByAmoutFromFeed, GLP_ARBITRUM, GMX, intervalUnixTime, NormalizedChainLinkMultiplier, TokenDecimals, WETH, _changeLatestPricefeed, _storeGlpPricefeed, _storePricefeed } from "./helpers"

export function handleAnswerUpdatedETH(event: AnswerUpdated): void {
  const price = event.params.current.times(NormalizedChainLinkMultiplier)

  _changeLatestPricefeed(WETH, price, event)

  _storePricefeed(event, WETH, intervalUnixTime.SEC, price)
  _storePricefeed(event, WETH, intervalUnixTime.MIN15, price)
  _storePricefeed(event, WETH, intervalUnixTime.MIN60, price)
  _storePricefeed(event, WETH, intervalUnixTime.HR4, price)
  _storePricefeed(event, WETH, intervalUnixTime.HR24, price)
  _storePricefeed(event, WETH, intervalUnixTime.DAY7, price)
}

export function handleUniswapGmxEthSwap(event: Swap): void {
  const ethPerGmx = event.params.amount0.times(BI_10.pow(18)).div(event.params.amount1)
  const gmxPriceUsd = ethPerGmx.times(BigInt.fromI32(100)).div(BigInt.fromI32(99)).abs()
  const price = getByAmoutFromFeed(gmxPriceUsd, WETH, TokenDecimals.WETH)

  _changeLatestPricefeed(GMX, price, event)

  _storePricefeed(event, GMX, intervalUnixTime.SEC, price)
  _storePricefeed(event, GMX, intervalUnixTime.MIN15, price)
  _storePricefeed(event, GMX, intervalUnixTime.MIN60, price)
  _storePricefeed(event, GMX, intervalUnixTime.HR4, price)
  _storePricefeed(event, GMX, intervalUnixTime.HR24, price)
  _storePricefeed(event, GMX, intervalUnixTime.DAY7, price)
}



export function handleAddLiquidity(event: AddLiquidity): void {
  _storeGlpPricefeed(GLP_ARBITRUM, event, event.params.aumInUsdg, event.params.glpSupply)
}

export function handleRemoveLiquidity(event: RemoveLiquidity): void {
  _storeGlpPricefeed(GLP_ARBITRUM, event, event.params.aumInUsdg, event.params.glpSupply)
}





// export function handleAnswerUpdatedBTC(event: AnswerUpdatedEvent): void {
//   _storeChainlinkPrice(BTC, event.params.current, event.block.timestamp)
// }



// export function handleAnswerUpdatedUNI(event: AnswerUpdatedEvent): void {
//   _storeChainlinkPrice(UNI, event.params.current, event.block.timestamp)
// }

// export function handleAnswerUpdatedLINK(event: AnswerUpdatedEvent): void {
//   _storeChainlinkPrice(LINK, event.params.current, event.block.timestamp)
// }

// export function handleAnswerUpdatedSPELL(event: AnswerUpdatedEvent): void {
//   _storeChainlinkPrice(SPELL, event.params.current, event.block.timestamp)
// }

// export function handleAnswerUpdatedMIM(event: AnswerUpdatedEvent): void {
//   _storeChainlinkPrice(MIM, event.params.current, event.block.timestamp)
// }

// export function handleAnswerUpdatedDAI(event: AnswerUpdatedEvent): void {
//   _storeChainlinkPrice(DAI, event.params.current, event.block.timestamp)
// }

// export function handleAnswerUpdatedSUSHI(event: AnswerUpdatedEvent): void {
//   _storeChainlinkPrice(SUSHI, event.params.current, event.block.timestamp)
// }

