import React, { useContext, useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'

import PrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/PrizePool'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { PaneTitle } from 'lib/components/PaneTitle'
import { TransactionsTakeTimeMessage } from 'lib/components/TransactionsTakeTimeMessage'
import { formatFutureDateInSeconds } from 'lib/utils/formatFutureDateInSeconds'
import { transactionsQuery } from 'lib/queries/transactionQueries'
import { useSendTransaction } from 'lib/hooks/useSendTransaction'

export const ExecuteWithdrawScheduledOrInstantWithFee = (props) => {
  const { nextStep, previousStep } = props

  const router = useRouter()
  const withdrawType = router.query.withdrawType

  const [txExecuted, setTxExecuted] = useState(false)

  const quantity = router.query.quantity
  const timelockDuration = router.query.timelockDuration
  const fee = router.query.fee
  const net = router.query.net
  const scheduledWithdrawal = withdrawType && withdrawType === 'scheduled'

  let formattedFutureDate
  if (timelockDuration) {
    formattedFutureDate = formatFutureDateInSeconds(
      Number(timelockDuration)
    )
  }

  const authControllerContext = useContext(AuthControllerContext)
  const { usersAddress, provider } = authControllerContext

  const poolData = useContext(PoolDataContext)
  const { pool } = poolData

  const ticker = pool?.underlyingCollateralSymbol
  const decimals = pool?.underlyingCollateralDecimals
  const poolAddress = pool?.poolAddress
  const controlledTokenAddress = pool?.ticket

  const tickerUpcased = ticker?.toUpperCase()




  const [txId, setTxId] = useState()

  let method = 'withdrawInstantlyFrom'
  if (scheduledWithdrawal) {
    method = 'withdrawWithTimelockFrom'
  }

  let txName = `Withdraw ${quantity} tickets instantly with fairness fee ($${quantity} ${ticker})`
  if (scheduledWithdrawal) {
    txName = `Schedule a withdrawal of ${quantity} tickets ($${quantity} ${ticker})`
  }

  const [sendTx] = useSendTransaction(txName)

  const transactionsQueryResult = useQuery(transactionsQuery)
  const transactions = transactionsQueryResult?.data?.transactions
  const tx = transactions?.find((tx) => tx.id === txId)

  const txInWallet = tx?.inWallet && !tx?.sent
  const txSent = tx?.sent && !tx?.completed
  const txCompleted = tx?.completed
  const txError = tx?.error

  const ready = txCompleted && !txError


  useEffect(() => {
    const runTx = () => {
      setTxExecuted(true)

      const params = [
        usersAddress,
        ethers.utils.parseUnits(
          quantity,  
          Number(decimals)
        ),
        controlledTokenAddress,
      ]

      if (!scheduledWithdrawal) {
        const sponsoredExitFee = '0'
        const maxExitFee = '1'
        params.push(
          ethers.utils.parseEther(sponsoredExitFee),
          ethers.utils.parseEther(maxExitFee)
        )
      }

      params.push({
        gasLimit: 500000
      })

      const id = sendTx(
        provider,
        PrizePoolAbi,
        poolAddress,
        method,
        params,
      )

      setTxId(id)
    }

    if (!txExecuted && quantity) {
      runTx()
    }
  }, [quantity])

  useEffect(() => {
    if (tx?.error) {
      previousStep()
    }
  }, [tx])

  useEffect(() => {
    if (ready) {
      nextStep()
    }
  }, [ready])

  const formattedWithdrawType = scheduledWithdrawal ? 'Schedule' : 'Instant'
  // yes this string is different:
  const formattedWithdrawTypePastTense = scheduledWithdrawal ? 'Scheduled' : 'Instant'

  return <>
    <PaneTitle small>
      {txInWallet && `Withdraw ${quantity} tickets`}
    </PaneTitle>

    <PaneTitle>
      {txInWallet && `Confirm ${formattedWithdrawTypePastTense} withdrawal`}
      {txSent && `${formattedWithdrawType} Withdrawal confirming...`}
    </PaneTitle>

    <div className='text-white bg-yellow py-2 px-8 rounded-xl w-9/12 sm:w-2/3 mx-auto'>
      {scheduledWithdrawal ? <>
        <div className='font-bold'>
          Note:
        </div>
          You are scheduling to receive ${quantity} DAI and your funds will be ready for withdrawal in: <br />
          {formattedFutureDate}
        </> : <>
        <div className='font-bold'>
          Note:
        </div>
        You are withdrawing ${net} {tickerUpcased} of your funds right now, less the ${fee} {tickerUpcased} fairness fee
      </>}
    </div>

    {txSent && !txCompleted && <>
      <TransactionsTakeTimeMessage />
    </>}
    
  </>
}
