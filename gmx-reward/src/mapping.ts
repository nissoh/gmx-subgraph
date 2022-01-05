import { ethereum } from "@graphprotocol/graph-ts"
import * as rewardRouter from "../generated/RewardRouterV2/RewardRouterV2"
import * as rewardTracker from "../generated/RewardTracker/RewardTracker"
import {
  Transaction,
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
import { getEthTokenAmountUsd, getGmxTokenAmountUsd } from "./helpers"
// import { getDailyRewardClaim } from "./interval"


function getId(event: ethereum.Event): string {
  return event.transaction.hash.toHexString() + "-" + event.logIndex.toString()
}

function _createTransaction(event: ethereum.Event): Transaction {
  const id = getId(event)
  const to = event.transaction.to
  const entity = new Transaction(id)

  entity.timestamp = event.block.timestamp.toI32()
  entity.blockNumber = event.block.number.toI32()
  entity.from = event.transaction.from.toHexString()

  if (to !== null) {
    entity.to = to.toHexString()
  }

  return entity
}

function _createTransactionIfNotExist(event: ethereum.Event): string {
  const id = event.transaction.hash.toHexString()
  let entity = Transaction.load(id)

  if (entity == null) {
    entity = _createTransaction(event)
    entity.save()
  }

  return id
}

export function handleStakeGmx(event: rewardRouter.StakeGmx): void {
  const entity = new StakeGmx(event.transaction.hash.toHexString())

  entity.account = event.params.account.toHexString()
  entity.token = event.params.token.toHexString()
  entity.amount = event.params.amount

  entity.transaction = _createTransactionIfNotExist(event)
  entity.timestamp = event.block.timestamp.toI32()

  entity.save()
}

export function handleUnstakeGmx(event: rewardRouter.UnstakeGmx): void {
  const entity = new UnstakeGmx(event.transaction.hash.toHexString())

  entity.account = event.params.account.toHexString()
  entity.token = event.params.token.toHexString()
  entity.amount = event.params.amount

  entity.transaction = _createTransactionIfNotExist(event)
  entity.timestamp = event.block.timestamp.toI32()

  entity.save()
}

export function handleStakeGlp(event: rewardRouter.StakeGlp): void {
  const entity = new StakeGlp(event.transaction.hash.toHexString())

  entity.account = event.params.account.toHexString()
  entity.amount = event.params.amount

  entity.transaction = _createTransactionIfNotExist(event)
  entity.timestamp = event.block.timestamp.toI32()

  entity.save()
}

export function handleUnstakeGlp(event: rewardRouter.UnstakeGlp): void {
  const entity = new UnstakeGlp(event.transaction.hash.toHexString())

  entity.account = event.params.account.toHexString()
  entity.amount = event.params.amount

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
  entity.amountUsd = getEthTokenAmountUsd(event.params.amount)
  entity.timestamp = event.block.timestamp.toI32()

  entity.save()
}
export function handleFeeGmxTrackerClaim(event: rewardTracker.Claim): void {
  const id = getId(event)
  const entity = new FeeGmxTrackerClaim(id)

  entity.receiver = event.params.receiver.toHexString()
  entity.amount = event.params.amount
  entity.amountUsd = getEthTokenAmountUsd(event.params.amount)
  entity.timestamp = event.block.timestamp.toI32()

  entity.save()
}

export function handleStakedGlpTrackerClaim(event: rewardTracker.Claim): void {
  const id = getId(event)
  const entity = new StakedGlpTrackerClaim(id)

  entity.receiver = event.params.receiver.toHexString()
  entity.amount = event.params.amount
  entity.amountUsd = getGmxTokenAmountUsd(event.params.amount)
  entity.timestamp = event.block.timestamp.toI32()

  entity.save()
}

export function handleStakedGmxTrackerClaim(event: rewardTracker.Claim): void {
  const id = getId(event)
  const entity = new StakedGmxTrackerClaim(id)

  entity.receiver = event.params.receiver.toHexString()
  entity.amount = event.params.amount
  entity.amountUsd = getGmxTokenAmountUsd(event.params.amount)
  entity.timestamp = event.block.timestamp.toI32()

  entity.save()
}