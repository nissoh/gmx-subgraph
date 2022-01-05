import { BigInt, ethereum } from "@graphprotocol/graph-ts"
import { AnswerUpdated } from '../generated/ChainlinkAggregatorETH/ChainlinkAggregator'
import { AddLiquidity, RemoveLiquidity } from "../generated/GlpManager/GlpManager"
import { Pricefeed } from "../generated/schema"
import { Swap } from '../generated/UniswapPool/UniswapPoolV3'
import { getTokenAmountUsd, GLP, GMX, intervalUnixTime, NormalizedChainLinkMultiplier, PRECISION, WETH } from "./helpers"
import { getIntervalId } from "./interval"



function _storePricefeed(event: ethereum.Event, token: string, interval: intervalUnixTime, price: BigInt): void {
  const intervalID = getIntervalId(interval, event)
  const id = token + ":" + interval.toString() + ':' + intervalID.toString()

  let entity = Pricefeed.load(id)
  if (entity == null) {
    entity = new Pricefeed(id)
  }

  entity.value = price
  entity.period = '_' + interval.toString()
  entity.feed = '_' + token
  entity.timestamp = intervalID * interval
  entity.save()
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


export function handleAnswerUpdatedETH(event: AnswerUpdated): void {
  const price = event.params.current.times(NormalizedChainLinkMultiplier)

  _storePricefeed(event, WETH, intervalUnixTime.SEC, price)
  _storePricefeed(event, WETH, intervalUnixTime.MIN15, price)
  _storePricefeed(event, WETH, intervalUnixTime.MIN60, price)
  _storePricefeed(event, WETH, intervalUnixTime.HR4, price)
  _storePricefeed(event, WETH, intervalUnixTime.HR24, price)
  _storePricefeed(event, WETH, intervalUnixTime.DAY7, price)
}

export function handleUniswapGmxEthSwap(event: Swap): void {
  const ethPerGmx = -(event.params.amount0 * BigInt.fromI32(10).pow(18) / event.params.amount1) * BigInt.fromI32(100) / BigInt.fromI32(99)
  const price = getTokenAmountUsd(WETH, ethPerGmx)

  _storePricefeed(event, GMX, intervalUnixTime.SEC, price)
  _storePricefeed(event, GMX, intervalUnixTime.MIN15, price)
  _storePricefeed(event, GMX, intervalUnixTime.MIN60, price)
  _storePricefeed(event, GMX, intervalUnixTime.HR4, price)
  _storePricefeed(event, GMX, intervalUnixTime.HR24, price)
  _storePricefeed(event, GMX, intervalUnixTime.DAY7, price)
}


const glpMultiplier = BigInt.fromI32(10).pow(18)

export function handleAddLiquidity(event: AddLiquidity): void {
  const price = event.params.aumInUsdg.times(glpMultiplier).div(event.params.glpSupply)

  _storePricefeed(event, GLP, intervalUnixTime.SEC, price)
  _storePricefeed(event, GLP, intervalUnixTime.MIN15, price)
  _storePricefeed(event, GLP, intervalUnixTime.MIN60, price)
  _storePricefeed(event, GLP, intervalUnixTime.HR4, price)
  _storePricefeed(event, GLP, intervalUnixTime.HR24, price)
  _storePricefeed(event, GLP, intervalUnixTime.DAY7, price)
}

export function handleRemoveLiquidity(event: RemoveLiquidity): void {
  const price = event.params.aumInUsdg.times(glpMultiplier).div(event.params.glpSupply)

  _storePricefeed(event, GLP, intervalUnixTime.SEC, price)
  _storePricefeed(event, GLP, intervalUnixTime.MIN15, price)
  _storePricefeed(event, GLP, intervalUnixTime.MIN60, price)
  _storePricefeed(event, GLP, intervalUnixTime.HR4, price)
  _storePricefeed(event, GLP, intervalUnixTime.HR24, price)
  _storePricefeed(event, GLP, intervalUnixTime.DAY7, price)
}
