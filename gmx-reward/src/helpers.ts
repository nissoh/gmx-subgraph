import { BigInt, ethereum } from "@graphprotocol/graph-ts"
import { Transaction, PricefeedLatest, PricefeedHistory } from "../generated/schema"
import { getIntervalId, getIntervalIdentifier } from "./interval"

export const BASIS_POINTS_DIVISOR = BigInt.fromI32(10000)
export const PRECISION = BigInt.fromI32(10).pow(30)

export const ZERO_BI = BigInt.fromI32(0)
export const ONE_BI = BigInt.fromI32(1)
export const ZERO_BD = BigInt.fromString('0')
export const ONE_BD = BigInt.fromString('1')
export const BI_18 = BigInt.fromI32(18)
export const NormalizedChainLinkMultiplier = BigInt.fromI32(10).pow(22)


export const WETH = "0x82af49447d8a07e3bd95bd0d56f35241523fbab1"
export const BTC = "0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f"
export const LINK = "0xf97f4df75117a78c1a5a0dbb814af92458539fb4"
export const UNI = "0xfa7f8980b0f1e64a2062791cc3b0871572f1f7f0"
export const USDT = "0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9"
export const USDC = "0xff970a61a04b1ca14834a43f5de4533ebddb5cc8"
export const MIM = "0xfea7a6a0b346362bf88a9e4a88416b77a57d6c2a"
export const SPELL = "0x3e6648c5a70a150a88bce65f4ad4d506fe15d2af"
export const SUSHI = "0xd4d42f0b6def4ce0383636770ef773390d85c61a"
export const FRAX = "0x17fc002b466eec40dae837fc4be5c67993ddbd6f"
export const DAI = "0xda10009cbd5d07dd0cecc66161fc93d7c9000da1"
export const GMX = "0xfc5a1a6eb076a2c7ad06ed22c90d7e710e35ad0a"
export const GLP = "0x321F653eED006AD1C29D174e17d96351BDe22649"




// export enum PriceFeedAddress {
//     WETH = 0x82af49447d8a07e3bd95bd0d56f35241523fbab1,
//     BTC = 0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f,
//     LINK = 0xf97f4df75117a78c1a5a0dbb814af92458539fb4,
//     UNI = 0xfa7f8980b0f1e64a2062791cc3b0871572f1f7f0,
//     USDT = 0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9,
//     USDC = 0xff970a61a04b1ca14834a43f5de4533ebddb5cc8,
//     MIM = 0xfea7a6a0b346362bf88a9e4a88416b77a57d6c2a,
//     SPELL = 0x3e6648c5a70a150a88bce65f4ad4d506fe15d2af,
//     SUSHI = 0xd4d42f0b6def4ce0383636770ef773390d85c61a,
//     FRAX = 0x17fc002b466eec40dae837fc4be5c67993ddbd6f,
//     DAI = 0xda10009cbd5d07dd0cecc66161fc93d7c9000da1,
//     GMX = 0xfc5a1a6eb076a2c7ad06ed22c90d7e710e35ad0a,
//     GLP = 0x321F653eED006AD1C29D174e17d96351BDe22649,
// }

// export class PriceFeedAddress {
//   static USDC = "0x82af49447d8a07e3bd95bd0d56f35241523fbab1"
//   static USDT = "0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f"
//   static BTC = "0xf97f4df75117a78c1a5a0dbb814af92458539fb4"
//   static WETH = "0xfa7f8980b0f1e64a2062791cc3b0871572f1f7f0"
//   static LINK = "0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9"
//   static UNI = "0xff970a61a04b1ca14834a43f5de4533ebddb5cc8"
//   static MIM = "0xfea7a6a0b346362bf88a9e4a88416b77a57d6c2a"
//   static SPELL = "0x3e6648c5a70a150a88bce65f4ad4d506fe15d2af"
//   static SUSHI = "0xd4d42f0b6def4ce0383636770ef773390d85c61a"
//   static FRAX = "0x17fc002b466eec40dae837fc4be5c67993ddbd6f"
//   static DAI = "0xda10009cbd5d07dd0cecc66161fc93d7c9000da1"
//   static GMX = "0xfc5a1a6eb076a2c7ad06ed22c90d7e710e35ad0a"
//   static GLP = "0x321F653eED006AD1C29D174e17d96351BDe22649"
// }

export enum TokenDecimals {
  USDC = 6,
  USDT = 6,
  BTC = 8,
  WETH = 18,
  LINK = 18,
  UNI = 18,
  MIM = 18,
  SPELL = 18,
  SUSHI = 18,
  FRAX = 18,
  DAI = 18,
  GMX = 18,
  GLP = 18,
}


export enum intervalUnixTime {
    SEC = 1,
    SEC60 = 60,
    MIN5 = 300,
    MIN15 = 900,
    MIN30 = 1800,
    MIN60 = 3600,
    HR2 = 7200,
    HR4 = 14400,
    HR8 = 28800,
    HR24 = 86400,
    DAY7 = 604800,
    MONTH = 2628000,
    MONTH2 = 5256000
}



export function timestampToDay(timestamp: BigInt): BigInt {
  return BigInt.fromI32(86400).times(BigInt.fromI32(86400)).div(timestamp)
}



export function getEthTokenAmountUsd(amount: BigInt): BigInt {
  const denominator = BigInt.fromI32(10).pow(18)
  const price = getTokenPrice(WETH)
  return amount.times(price).div(denominator)
}

export function getGmxTokenAmountUsd(amount: BigInt): BigInt {
  const denominator = BigInt.fromI32(10).pow(18)
  const price = getTokenPrice(GMX)
  return amount.times(price).div(denominator)
}


export function getTokenPrice(feedAddress: string): BigInt {
  const chainlinkPriceEntity = PricefeedLatest.load(feedAddress)

  if (chainlinkPriceEntity == null) {
    throw new Error(`could not get pricefeed: ${feedAddress}`)
  }

  return chainlinkPriceEntity.value

  // if (feedAddress === GMX || feedAddress === GLP) {
  //   return chainlinkPriceEntity.value
  // }

  // // all chainlink prices have 8 decimals
  // // adjusting them to fit GMX 30 decimals USD values
  // return chainlinkPriceEntity.value.times(NormalizedChainLinkMultiplier)
}



export function getId(event: ethereum.Event): string {
  return event.transaction.hash.toHexString() + "-" + event.logIndex.toString()
}

export function _createTransaction(event: ethereum.Event): Transaction {
  let id = getId(event)
  let txTo = event.transaction.to

  let entity = new Transaction(id)
  entity.timestamp = event.block.timestamp.toI32()
  entity.blockNumber = event.block.number.toI32()
  entity.from = event.transaction.from.toHexString()

  entity.to = txTo.toHexString()

  return entity
}


export function _createTransactionIfNotExist(event: ethereum.Event): string {
  let id = event.transaction.hash.toHexString()
  let entity = Transaction.load(id)

  let txTo = event.transaction.to
  if (entity == null && txTo !== null) {
    entity = _createTransaction(event)
    entity.save()
  }

  return id
}


export function _storeLatestPricefeed(feedAddress: string, price: BigInt, timestamp: i32): PricefeedLatest {
  let feed = PricefeedLatest.load(feedAddress)
  if (feed === null) {
    feed = new PricefeedLatest(feedAddress)
    feed.timestamp = timestamp
  }
  feed.value = price
  feed.save()

  return feed
}



export function _storePricefeed(event: ethereum.Event, feedAddress: string, interval: intervalUnixTime, price: BigInt): void {
  const intervalID = getIntervalId(interval, event)
  const id = getIntervalIdentifier(event, feedAddress, interval)


  let entity = PricefeedHistory.load(id)
  if (entity == null) {
    entity = new PricefeedHistory(id)

    entity.interval = '_' + interval.toString()
    entity.feed = '_' + feedAddress
    entity.timestamp = intervalID * interval
    entity.o = price
    entity.h = price
    entity.l = price
  }

  if (price > entity.h) {
    entity.h = price
  }

  if (price < entity.l) {
    entity.l = price
  }

  entity.c = price

  entity.save()
}


