import * as rewardRouter from "../generated/RewardRouterV2/RewardRouterV2"
import * as rewardTracker from "../generated/RewardTracker/RewardTracker"
import {
  StakeGmx,
  UnstakeGmx,
  StakeGlp,
  UnstakeGlp,
  BonusGmxTrackerTransfer,
  FeeGlpTrackerTransfer,
  FeeGmxTrackerTransfer,
  StakedGlpTrackerTransfer,
  StakedGmxTrackerTransfer,
  StakedGlpTrackerClaim,
  StakedGmxTrackerClaim,
  FeeGmxTrackerClaim,
  FeeGlpTrackerClaim,
} from "../generated/schema"
import { AVAX, getId, getByAmoutFromFeed, GLP_AVALANCHE, GMX, _createTransactionIfNotExist, TokenDecimals } from "./helpers"



export function handleStakeGmx(event: rewardRouter.StakeGmx): void {
  const entity = new StakeGmx(event.transaction.hash.toHexString())

  entity.account = event.params.account.toHexString()
  entity.token = event.params.token.toHexString()
  entity.amount = event.params.amount
  entity.amountUsd = getByAmoutFromFeed(event.params.amount, GMX, TokenDecimals.GMX)

  entity.transaction = _createTransactionIfNotExist(event)
  entity.timestamp = event.block.timestamp.toI32()

  entity.save()
}

export function handleUnstakeGmx(event: rewardRouter.UnstakeGmx): void {
  const entity = new UnstakeGmx(event.transaction.hash.toHexString())

  entity.account = event.params.account.toHexString()
  entity.token = event.params.token.toHexString()
  entity.amount = event.params.amount
  entity.amountUsd = getByAmoutFromFeed(event.params.amount, GMX, TokenDecimals.GMX)

  entity.transaction = _createTransactionIfNotExist(event)
  entity.timestamp = event.block.timestamp.toI32()

  entity.save()
}

export function handleStakeGlp(event: rewardRouter.StakeGlp): void {
  const entity = new StakeGlp(event.transaction.hash.toHexString())

  entity.account = event.params.account.toHexString()
  entity.amount = event.params.amount
  entity.amountUsd = getByAmoutFromFeed(event.params.amount, GLP_AVALANCHE, TokenDecimals.GLP)

  entity.transaction = _createTransactionIfNotExist(event)
  entity.timestamp = event.block.timestamp.toI32()

  entity.save()
}

export function handleUnstakeGlp(event: rewardRouter.UnstakeGlp): void {
  const entity = new UnstakeGlp(event.transaction.hash.toHexString())

  entity.account = event.params.account.toHexString()
  entity.amount = event.params.amount
  entity.amountUsd = getByAmoutFromFeed(event.params.amount, GLP_AVALANCHE, TokenDecimals.GLP)

  entity.transaction = _createTransactionIfNotExist(event)
  entity.timestamp = event.block.timestamp.toI32()

  entity.save()
}



export function handleStakedGmxTrackerTransfer(event: rewardTracker.Transfer): void {
  const id = getId(event)
  const entity = new StakedGmxTrackerTransfer(id)

  entity.from = event.params.from.toHexString()
  entity.to = event.params.to.toHexString()
  entity.value = event.params.value
  entity.timestamp = event.block.timestamp.toI32()

  entity.save()
}

export function handleBonusGmxTrackerTransfer(event: rewardTracker.Transfer): void {
  const id = getId(event)
  const entity = new BonusGmxTrackerTransfer(id)

  entity.from = event.params.from.toHexString()
  entity.to = event.params.to.toHexString()
  entity.value = event.params.value
  entity.timestamp = event.block.timestamp.toI32()

  entity.save()
}
export function handleFeeGmxTrackerTransfer(event: rewardTracker.Transfer): void {
  const id = getId(event)
  const entity = new FeeGmxTrackerTransfer(id)

  entity.from = event.params.from.toHexString()
  entity.to = event.params.to.toHexString()
  entity.value = event.params.value
  entity.timestamp = event.block.timestamp.toI32()

  entity.save()
}
export function handleFeeGlpTrackerTransfer(event: rewardTracker.Transfer): void {
  const id = getId(event)
  const entity = new FeeGlpTrackerTransfer(id)

  entity.from = event.params.from.toHexString()
  entity.to = event.params.to.toHexString()
  entity.value = event.params.value
  entity.timestamp = event.block.timestamp.toI32()

  entity.save()
}
export function handleStakedGlpTrackerTransfer(event: rewardTracker.Transfer): void {
  const id = getId(event)
  const entity = new StakedGlpTrackerTransfer(id)

  entity.from = event.params.from.toHexString()
  entity.to = event.params.to.toHexString()
  entity.value = event.params.value
  entity.timestamp = event.block.timestamp.toI32()

  entity.save()
}



export function handleFeeGlpTrackerClaim(event: rewardTracker.Claim): void {
  const id = getId(event)
  const entity = new FeeGlpTrackerClaim(id)

  entity.receiver = event.params.receiver.toHexString()
  entity.amount = event.params.amount
  entity.amountUsd = getByAmoutFromFeed(event.params.amount, AVAX, TokenDecimals.AVAX)

  entity.timestamp = event.block.timestamp.toI32()

  entity.save()
}

export function handleFeeGmxTrackerClaim(event: rewardTracker.Claim): void {
  const id = getId(event)
  const entity = new FeeGmxTrackerClaim(id)

  entity.receiver = event.params.receiver.toHexString()
  entity.amount = event.params.amount
  entity.amountUsd = getByAmoutFromFeed(event.params.amount, AVAX, TokenDecimals.AVAX)
  entity.timestamp = event.block.timestamp.toI32()

  entity.save()
}

export function handleStakedGlpTrackerClaim(event: rewardTracker.Claim): void {
  const id = getId(event)
  const entity = new StakedGlpTrackerClaim(id)

  entity.receiver = event.params.receiver.toHexString()
  entity.amount = event.params.amount
  entity.amountUsd = getByAmoutFromFeed(event.params.amount, GLP_AVALANCHE, TokenDecimals.GLP)
  entity.timestamp = event.block.timestamp.toI32()

  entity.save()
}

export function handleStakedGmxTrackerClaim(event: rewardTracker.Claim): void {
  const id = getId(event)
  const entity = new StakedGmxTrackerClaim(id)

  entity.receiver = event.params.receiver.toHexString()
  entity.amount = event.params.amount
  entity.amountUsd = getByAmoutFromFeed(event.params.amount, GMX, TokenDecimals.GMX)
  entity.timestamp = event.block.timestamp.toI32()

  entity.save()
}