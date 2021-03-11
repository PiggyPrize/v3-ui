import gql from 'graphql-tag'

import { prizeStrategyFragment } from 'lib/fragments/prizeStrategyFragment'
import { prizePoolAccountFragment } from 'lib/fragments/prizePoolAccountFragment'
import { controlledTokenFragment } from 'lib/fragments/controlledTokenFragment'

export const prizePoolFragment = gql`
  fragment prizePoolFragment on PrizePool {
    id

    prizeStrategy {
      ...prizeStrategyFragment
    }

    compoundPrizePool {
      id
      cToken
    }

    sablierStream {
      id
    }

    underlyingCollateralToken
    underlyingCollateralDecimals
    underlyingCollateralName
    underlyingCollateralSymbol

    maxExitFeeMantissa
    maxTimelockDuration
    timelockTotalSupply
    liquidityCap

    cumulativePrizeNet

    currentPrizeId
    currentState

    # prizePoolAccounts {
    #   ...prizePoolAccountFragment
    # }
    controlledTokens {
      ...controlledTokenFragment
    }

    tokenCreditRates {
      id
      creditRateMantissa
      creditLimitMantissa
    }
  }
  ${prizeStrategyFragment}

  ${controlledTokenFragment}
`
// ${prizePoolAccountFragment}
