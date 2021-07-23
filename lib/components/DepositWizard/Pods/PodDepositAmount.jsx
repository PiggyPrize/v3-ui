import React, { useEffect } from 'react'
import classnames from 'classnames'
import { useTokenBalance, useTokenBalances, useUsersAddress } from '@pooltogether/hooks'

import { DepositAmount } from 'lib/components/DepositWizard/DepositAmount'
import { useForm } from 'react-hook-form'
import { ethers } from 'ethers'
import {
  calculateUsersOdds,
  getMinPrecision,
  numberWithCommas,
  toNonScaledUsdString
} from '@pooltogether/utilities'
import { Odds } from 'lib/components/Odds'
import { Amount } from '@pooltogether/react-components'

export const PodDepositAmount = (props) => {
  const {
    quantity: queryQuantity,
    pod,
    chainId,
    contractAddress,
    tokenAddress,
    nextStep,
    form
  } = props
  const tokenSymbol = pod.tokens.underlyingToken.symbol
  const podTicketAddress = pod.tokens.podStablecoin.address
  const poolTicketAddress = pod.prizePool.tokens.ticket.address
  const decimals = pod.tokens.underlyingToken.decimals

  const usersAddress = useUsersAddress()
  const { data: usersBalance, isFetched: isUsersBalanceFetched } = useTokenBalances(
    chainId,
    usersAddress,
    [tokenAddress, podTicketAddress]
  )
  const { data: podTicketBalance, isFetched: isPodBalanceFetched } = useTokenBalance(
    chainId,
    contractAddress,
    poolTicketAddress
  )

  useEffect(() => {
    console.log('PodDepositAmount MOUNTED')
  }, [])

  const isFetched = isUsersBalanceFetched && isPodBalanceFetched

  const { watch, formState } = form
  const quantity = watch('quantity', false)

  return (
    <>
      <DepositAmount
        chainId={chainId}
        usersAddress={usersAddress}
        form={form}
        usersBalance={usersBalance?.[tokenAddress].amount}
        label='Deposit into the DAI Pod'
        tokenSymbol={tokenSymbol}
        tokenAddress={tokenAddress}
        decimals={decimals}
        nextStep={nextStep}
        quantity={queryQuantity}
      />
      <div className='flex mx-auto mt-8'>
        <PodWinningOdds
          isQuantityValid={formState.isValid}
          isFetched={isFetched}
          pod={pod}
          quantity={quantity}
          podBalanceUnformatted={podTicketBalance?.amountUnformatted}
        />
        <UsersPrize
          isQuantityValid={formState.isValid}
          isFetched={isFetched}
          pod={pod}
          quantity={quantity}
          usersBalanceUnformatted={usersBalance?.[podTicketAddress].amountUnformatted}
        />
      </div>
    </>
  )
}

const PodWinningOdds = (props) => {
  const { isQuantityValid, isFetched, pod, quantity, podBalanceUnformatted } = props

  if (!isFetched || !isQuantityValid) {
    return (
      <SmallCard className='mr-2'>
        <Title>Your winning odds:</Title>
        <Details>--</Details>
      </SmallCard>
    )
  }

  const decimals = pod.tokens.underlyingToken.decimals
  const numberOfWinners = pod.prizePool.config.numberOfWinners
  // Balance of pod
  const quantityUnformatted = ethers.utils.parseUnits(quantity || '0', decimals)
  const podsNewBalanceUnformatted = quantityUnformatted.add(podBalanceUnformatted)
  // Total supply of prize pool
  const ticketTotalSupplyUnformatted = pod.prizePool.tokens.ticket.totalSupplyUnformatted
  const sponsorshipTotalSupplyUnformatted = pod.prizePool.tokens.sponsorship.totalSupplyUnformatted
  const totalSupplyUnformatted = ticketTotalSupplyUnformatted
    .add(sponsorshipTotalSupplyUnformatted)
    .add(quantityUnformatted)

  return (
    <SmallCard className='mr-2'>
      <Title>Pod winning odds:</Title>
      {podsNewBalanceUnformatted.isZero() ? (
        <Details>--</Details>
      ) : (
        <Odds
          ticketSupplyUnformatted={totalSupplyUnformatted}
          decimals={decimals}
          numberOfWinners={numberOfWinners}
          usersBalance={podsNewBalanceUnformatted}
        />
      )}
    </SmallCard>
  )
}

const UsersPrize = (props) => {
  const { isQuantityValid, isFetched, pod, quantity, usersBalanceUnformatted } = props

  if (!isFetched || !isQuantityValid || (!quantity && usersBalanceUnformatted.isZero())) {
    return (
      <SmallCard className='ml-2'>
        <Title>Your prize if the pod wins:</Title>
        <Details>--</Details>
      </SmallCard>
    )
  }

  const decimals = pod.tokens.underlyingToken.decimals
  const quantityUnformatted = ethers.utils.parseUnits(quantity || '0', decimals)
  const singlePrizeScaled = pod.prize.totalValuePerWinnerUsdScaled.toNumber()
  const usersNewBalanceUnformatted = quantityUnformatted.add(usersBalanceUnformatted)
  const ticketTotalSupplyUnformatted = pod.tokens.ticket.totalSupplyUnformatted
  const sponsorshipTotalSupplyUnformatted = pod.tokens.sponsorship.totalSupplyUnformatted
  const totalSupplyUnformatted = ticketTotalSupplyUnformatted
    .add(sponsorshipTotalSupplyUnformatted)
    .add(quantityUnformatted)

  const usersBalanceFloat = Number(
    ethers.utils.formatUnits(usersNewBalanceUnformatted, Number(decimals))
  )
  const totalSupplyFloat = Number(
    ethers.utils.formatUnits(totalSupplyUnformatted, Number(decimals))
  )
  const usersOwnershipPercentage = usersBalanceFloat / totalSupplyFloat
  const usersPrize = (singlePrizeScaled * usersOwnershipPercentage) / 100

  console.log(
    totalSupplyUnformatted.toString(),
    usersNewBalanceUnformatted.toString(),
    usersBalanceFloat,
    totalSupplyFloat,
    usersOwnershipPercentage,
    usersPrize
  )

  return (
    <SmallCard className='ml-2'>
      <Title>Your prize if the pod wins:</Title>
      <Details className='text-flashy'>
        $<Amount>{numberWithCommas(usersPrize, { decimals: 0, precision: 2 })}</Amount>
      </Details>
    </SmallCard>
  )
}

const SmallCard = (props) => (
  <div className={classnames('bg-card py-2 px-4 rounded flex flex-col', props.className)}>
    {props.children}
  </div>
)

const Title = (props) => <span className='text-center text-xs opacity-80'>{props.children}</span>
const Details = (props) => (
  <span className={classnames('text-center mt-2', props.className)}>{props.children}</span>
)
