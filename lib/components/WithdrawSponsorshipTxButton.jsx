import React, { useContext, useEffect, useState } from 'react'
import { ethers } from 'ethers'

import PrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/PrizePool'

import { useTranslation } from 'lib/../i18n'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { usePool } from 'lib/hooks/usePool'
import { Button } from 'lib/components/Button'
import { useSendTransaction } from 'lib/hooks/useSendTransaction'
import { useTransaction } from 'lib/hooks/useTransaction'

export function WithdrawSponsorshipTxButton(props) {
  const { t } = useTranslation()
  
  const {
    quantityBN,
    quantity,
    needsApproval,
    tickerUpcased,
  } = props

  const { usersAddress } = useContext(AuthControllerContext)
  const { pool } = usePool()

  const poolAddress = pool?.poolAddress
  const sponsorshipAddress = pool?.sponsorshipToken?.id
  // const sponsorshipAddress = pool?.prizeStrategy?.singleRandomWinner?.sponsorship?.id
  
  const [txId, setTxId] = useState(0)
  const txName = t(`withdrawSponsorshipAmountTicker`, {
    amount: quantity,
    ticker: tickerUpcased
  })
  const method = 'withdrawInstantlyFrom'
  const sendTx = useSendTransaction()
  const tx = useTransaction(txId)

  const withdrawSponsorshipTxInFlight = !tx?.cancelled && (tx?.inWallet || tx?.sent)

  const handleWithdrawSponsorshipClick = async (e) => {
    e.preventDefault()

    // there should be no exit fee when withdrawing sponsorship
    const maxExitFee = '0'

    const params = [
      usersAddress,
      quantityBN,
      sponsorshipAddress,
      ethers.utils.parseEther(maxExitFee),
    ]

    const id = await sendTx(
      txName,
      PrizePoolAbi,
      poolAddress,
      method,
      params
    )
    setTxId(id)
  }


  return <>
    <Button
      noAnim
      textSize='lg'
      onClick={handleWithdrawSponsorshipClick}
      disabled={!quantity || needsApproval || withdrawSponsorshipTxInFlight}
      className={'w-full'}
    >
      Withdraw sponsorship
    </Button>
  </>
}
