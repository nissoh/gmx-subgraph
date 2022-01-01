import { ethereum, BigInt } from "@graphprotocol/graph-ts"
import { DailyClaimedReward } from "../generated/schema"
import * as rewardTracker from "../generated/RewardTracker/RewardTracker"

export const ZERO_BI = BigInt.fromI32(0)

export function getHourlyId(event: ethereum.Event): i32 {
  return event.block.timestamp.toI32() / 3600
}

export function getDailyId(event: ethereum.Event): i32 {
  return event.block.timestamp.toI32() / 86400
}

export function getWeeklyId(event: ethereum.Event): i32 {
  return event.block.timestamp.toI32() / 604800
}

export function getDailyRewardClaim(event: rewardTracker.Claim): DailyClaimedReward {
  const dayID = getDailyId(event)
  const receiver = event.params.receiver.toHexString()
  const tickDayDataID = receiver + '-' + dayID.toString()

  let tickDayData = DailyClaimedReward.load(tickDayDataID)

  if (tickDayData === null) {
    tickDayData = new DailyClaimedReward(tickDayDataID)
    tickDayData.timestamp = dayID * 86400
    tickDayData.receiver = receiver
    tickDayData.feeGlp = ZERO_BI
    tickDayData.feeGmx = ZERO_BI
    tickDayData.stakeGlp = ZERO_BI
    tickDayData.stakeGmx = ZERO_BI
    tickDayData.totalUsd = ZERO_BI
  }


  return tickDayData as DailyClaimedReward
}