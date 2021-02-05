import React from 'react'
import Link from 'next/link'
import BeatLoader from 'react-spinners/BeatLoader'
import { ethers } from 'ethers'

import { useTranslation } from 'lib/../i18n'
import { Odds } from 'lib/components/Odds'
import { PoolNumber } from 'lib/components/PoolNumber'
import { useAccount } from 'lib/hooks/useAccount'
import { usePrizePoolAccountQuery } from 'lib/hooks/usePrizePoolAccountQuery'
import { getPrizePoolAccountControlledTokenBalance } from 'lib/utils/getPrizePoolAccountControlledTokenBalance'
import { numberWithCommas } from 'lib/utils/numberWithCommas'
import { shorten } from 'lib/utils/shorten'

export const PrizeWinner = (props) => {
  const { t } = useTranslation()

  const { grandPrizeWinner, pool, prize, awardedControlledToken } = props

  const ticketAddress = pool?.ticketToken?.id?.toLowerCase()
  const decimals = pool?.underlyingCollateralDecimals || 18

  const blockNumber = prize?.awardedBlock

  const winnersAddress = awardedControlledToken.winner

  const { accountData } = useAccount(winnersAddress, blockNumber - 1)

  const ctBalance = accountData?.controlledTokenBalances.find(
    (ct) => ct.controlledToken.id === ticketAddress
  )

  const usersTicketBalance = ctBalance?.balance
    ? Number(ethers.utils.formatUnits(ctBalance.balance, Number(decimals)))
    : ''

  if (!ctBalance) {
    return (
      <tr>
        <td>
          <BeatLoader size={3} color='rgba(255,255,255,0.3)' />
        </td>
      </tr>
    )
  }

  return (
    <>
      <tr>
        <td className='py-2'>{grandPrizeWinner ? t('grandPrize') : t('runnerUp')}</td>

        <td>
          <Link href='/players/[playerAddress]' as={`/players/${winnersAddress}`}>
            <a className='text-accent-1'>{shorten(winnersAddress)}</a>
          </Link>
        </td>

        <td>
          <span className='block xs:inline-block'>
            <Odds
              fontSansRegular
              className='font-bold text-flashy'
              pool={pool}
              usersBalance={ctBalance?.balance}
            />
          </span>
        </td>

        <td width='70'>
          <PoolNumber>{numberWithCommas(usersTicketBalance, { precision: 0 })}</PoolNumber>
        </td>
      </tr>
    </>
  )
}
