import { BigInt, ethereum, TypedMap } from "@graphprotocol/graph-ts"
import {
  ChainlinkPrice,
  Transaction,
  UniswapPrice
} from "../generated/schema"

export let BASIS_POINTS_DIVISOR = BigInt.fromI32(10000)
export let PRECISION = BigInt.fromI32(10).pow(30)

export let ZERO_BI = BigInt.fromI32(0)
export let ONE_BI = BigInt.fromI32(1)
export let ZERO_BD = BigInt.fromString('0')
export let ONE_BD = BigInt.fromString('1')
export let BI_18 = BigInt.fromI32(18)


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

export function timestampToDay(timestamp: BigInt): BigInt {
  return BigInt.fromI32(86400).times(BigInt.fromI32(86400)).div(timestamp)
}

export function getTokenDecimals(token: string): u8 {
  let tokenDecimals = new Map<string, i32>()
  tokenDecimals.set(WETH, 18)
  tokenDecimals.set(BTC, 8)
  tokenDecimals.set(LINK, 18)
  tokenDecimals.set(UNI, 18)
  tokenDecimals.set(USDC, 6)
  tokenDecimals.set(USDT, 6)
  tokenDecimals.set(MIM, 18)
  tokenDecimals.set(SPELL, 18)
  tokenDecimals.set(SUSHI, 18)
  tokenDecimals.set(FRAX, 18)
  tokenDecimals.set(DAI, 18)
  tokenDecimals.set(GMX, 18)

  return tokenDecimals.get(token) as u8
}

export function getTokenAmountUsd(token: string, amount: BigInt): BigInt {
  let decimals = getTokenDecimals(token)
  let denominator = BigInt.fromI32(10).pow(decimals)
  let price = getTokenPrice(token)
  return amount.times(price).div(denominator)
}


const NormalizedChainLinkMultiplier = BigInt.fromI32(10).pow(22)
export function getTokenPrice(token: string): BigInt {
  if (token !== GMX) {
    let chainlinkPriceEntity = ChainlinkPrice.load(token)
    if (chainlinkPriceEntity !== null) {
      // all chainlink prices have 8 decimals
      // adjusting them to fit GMX 30 decimals USD values
      return chainlinkPriceEntity.value.times(NormalizedChainLinkMultiplier)
    }
  }

  if (token === GMX) {
    let uniswapPriceEntity = UniswapPrice.load(GMX)

    if (uniswapPriceEntity !== null) {
      return uniswapPriceEntity.value
    }
  }

  let prices = new TypedMap<String, BigInt>()
  prices.set(WETH, BigInt.fromI32(3350).times(PRECISION))
  prices.set(BTC, BigInt.fromI32(45000).times(PRECISION))
  prices.set(LINK, BigInt.fromI32(25).times(PRECISION))
  prices.set(UNI, BigInt.fromI32(23).times(PRECISION))
  prices.set(USDC, PRECISION)
  prices.set(USDT, PRECISION)
  prices.set(MIM, PRECISION)
  prices.set(SPELL, PRECISION.div(BigInt.fromI32(50))) // ~2 cents
  prices.set(SUSHI, BigInt.fromI32(10).times(PRECISION))
  prices.set(FRAX, PRECISION)
  prices.set(DAI, PRECISION)
  prices.set(GMX, BigInt.fromI32(30).times(PRECISION))

  return prices.get(token) as BigInt
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