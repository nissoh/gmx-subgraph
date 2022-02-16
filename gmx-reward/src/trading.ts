/* eslint-disable prefer-const */
import { ethereum, store, log } from "@graphprotocol/graph-ts"
import * as contract from "../generated/gmxVault/gmxVault"

import {
  ClosePosition,
  DecreasePosition,
  IncreasePosition, LiquidatePosition, UpdatePosition, AggregatedTradeOpen, AggregatedTradeSettled, PriceLatest
} from "../generated/schema"

const namedEventId = (name: string, ev: ethereum.Event): string => name + ':' + ev.transaction.hash.toHex()


export function handleIncreasePosition(event: contract.IncreasePosition): void {
  const timestamp = event.block.timestamp.toI32()
  const entity = new IncreasePosition(namedEventId('IncreasePosition', event)) // we prevent 

  entity.indexedAt = timestamp

  entity.key = event.params.key.toHex()
  entity.account = event.params.account.toHex()
  entity.collateralToken = event.params.collateralToken.toHex()
  entity.indexToken = event.params.indexToken.toHex()

  entity.isLong = event.params.isLong

  entity.collateralDelta = event.params.collateralDelta
  entity.sizeDelta = event.params.sizeDelta
  entity.price = event.params.price
  entity.fee = event.params.fee

  entity.save()
  

  let aggTradeOpen = AggregatedTradeOpen.load(entity.key)

  if (aggTradeOpen === null) {
    aggTradeOpen = new AggregatedTradeOpen(entity.key)
    aggTradeOpen.indexedAt = timestamp
    aggTradeOpen.indexToken = entity.indexToken

    aggTradeOpen.account = event.params.account.toHex()

    aggTradeOpen.initialPosition = entity.id
    aggTradeOpen.increaseList = []
    aggTradeOpen.decreaseList = []
    aggTradeOpen.updateList = []
  }


  const increaseList = aggTradeOpen.increaseList
  increaseList.push(entity.id)
  aggTradeOpen.increaseList = increaseList

  aggTradeOpen.save()

}

export function handleDecreasePosition(event: contract.DecreasePosition): void {
  const timestamp = event.block.timestamp.toI32()

  const tradeKey = event.params.key.toHex()
  const tradeId = namedEventId('DecreasePosition', event)
  const entity = new DecreasePosition(tradeId)

  entity.indexedAt = timestamp

  entity.key = event.params.key.toHex()
  entity.account = event.params.account.toHex()
  entity.collateralToken = event.params.collateralToken.toHex()
  entity.indexToken = event.params.indexToken.toHex()

  entity.isLong = event.params.isLong

  entity.collateralDelta = event.params.collateralDelta
  entity.sizeDelta = event.params.sizeDelta
  entity.price = event.params.price
  entity.fee = event.params.fee


  entity.save()


  const aggTradeOpen = AggregatedTradeOpen.load(tradeKey)

  if (aggTradeOpen) {
    const decreaseList = aggTradeOpen.decreaseList
    decreaseList.push(entity.id)
    aggTradeOpen.decreaseList = decreaseList
    aggTradeOpen.save()
  } else {
    log.error('unable to attach entity to account aggregation: aggregatedId: #{}', [entity.id])
  }

}

export function handleUpdatePosition(event: contract.UpdatePosition): void {
  const timestamp = event.block.timestamp.toI32()

  const tradeKey = event.params.key.toHex()
  const tradeId = namedEventId('UpdatePosition', event)
  const entity = new UpdatePosition(tradeId)

  entity.indexedAt = timestamp

  entity.key = event.params.key.toHex()

  entity.size = event.params.size
  entity.collateral = event.params.collateral
  entity.reserveAmount = event.params.reserveAmount
  entity.realisedPnl = event.params.realisedPnl
  entity.averagePrice = event.params.averagePrice
  entity.entryFundingRate = event.params.entryFundingRate
    
  const aggTradeOpen = AggregatedTradeOpen.load(tradeKey)

  if (aggTradeOpen) {
    const price = PriceLatest.load(aggTradeOpen.indexToken)
    if (price) {
      entity.marketPrice = price.value
    }

    const updates = aggTradeOpen.updateList
    updates.push(entity.id)

    aggTradeOpen.updateList = updates
    aggTradeOpen.save()

  } else {
    log.error('unable to attach entity to account aggregation: aggregatedId #{}', [entity.id])
  }

  entity.save()

}

export function handleClosePosition(event: contract.ClosePosition): void {
  const timestamp = event.block.timestamp.toI32()

  const tradeKey = event.params.key.toHex()
  const tradeId = namedEventId('ClosePosition', event)
  const entity = new ClosePosition(tradeId)

  entity.indexedAt = timestamp
  entity.key = event.params.key.toHex()

  entity.size = event.params.size
  entity.collateral = event.params.collateral
  entity.reserveAmount = event.params.reserveAmount
  entity.realisedPnl = event.params.realisedPnl
  entity.averagePrice = event.params.averagePrice
  entity.entryFundingRate = event.params.entryFundingRate

  entity.save()


  const aggTradeOpen = AggregatedTradeOpen.load(tradeKey)

  if (aggTradeOpen) {
    const settled = _createAggregatedTradeSettled(event, aggTradeOpen)
    settled.closedPosition = entity.id
    settled.save()

    store.remove('AggregatedTradeOpen', aggTradeOpen.id)
  }
}

export function handleLiquidatePosition(event: contract.LiquidatePosition): void {
  const timestamp = event.block.timestamp.toI32()

  const tradeKey = event.params.key.toHex()
  const tradeId = namedEventId('LiquidatePosition', event)
  const entity = new LiquidatePosition(tradeId)

  entity.indexedAt = timestamp
  entity.key = event.params.key.toHex()
  entity.account = event.params.account.toHex()
  entity.collateralToken = event.params.collateralToken.toHex()
  entity.indexToken = event.params.indexToken.toHex()

  entity.isLong = event.params.isLong

  entity.size = event.params.size
  entity.collateral = event.params.collateral
  entity.reserveAmount = event.params.reserveAmount
  entity.realisedPnl = event.params.realisedPnl
  entity.markPrice = event.params.markPrice

  entity.save()


  const aggTradeOpen = AggregatedTradeOpen.load(tradeKey)

  if (aggTradeOpen) {
    const settled = _createAggregatedTradeSettled(event, aggTradeOpen)
    settled.LiquidatedPosition = entity.id
    settled.save()

    store.remove('AggregatedTradeOpen', aggTradeOpen.id)
  }
}


function _createAggregatedTradeSettled(event: ethereum.Event, aggTradeOpen: AggregatedTradeOpen): AggregatedTradeSettled {
  const settled = new AggregatedTradeSettled(namedEventId('AggregatedTradeSettled', event))
  settled.indexedAt = event.block.timestamp.toI32()
  settled.indexToken = aggTradeOpen.indexToken

  settled.account = aggTradeOpen.account
  settled.initialPositionIndexAt = aggTradeOpen.indexedAt

  settled.initialPosition = aggTradeOpen.initialPosition

  settled.decreaseList = aggTradeOpen.decreaseList
  settled.increaseList = aggTradeOpen.increaseList
  settled.updateList = aggTradeOpen.updateList
  
  return settled
}


// function _storeAccountDailyAggregation(event: ethereum.Event, account: string,
//   size: BigInt, collateral: BigInt, pnl: BigInt
// ): AccountIntervalSummary {
//   const interval = intervalUnixTime.HR24
//   const id = getIntervalIdentifier(event, account, interval)

//   let entity = AccountIntervalSummary.load(id)
//   if (entity == null) {
//     entity = new AccountIntervalSummary(id)

//     entity.interval = '_' + interval.toString()
//     entity.account = account

//     entity.tradeCount = 0
//     entity.winCount = 0

//     entity.accumulatedLeverage = ZERO_BI
//     entity.leverage = ZERO_BI
//     entity.size = ZERO_BI
//     entity.pnl = ZERO_BI
//   }

//   const leverage = size.div(collateral)

//   entity.tradeCount = entity.tradeCount.plus(1)
//   entity.winCount = pnl.gt(ZERO_BI)

//   entity.collateral = collateral
//   entity.accumulatedLeverage = entity.accumulatedLeverage.plus(leverage)
//   entity.leverage = entity.accumulatedLeverage.div(entity.tradeCount)
//   entity.size = entity.size.plus(size)
//   entity.pnl = entity.pnl.plus(pnl)

//   return entity
// }
