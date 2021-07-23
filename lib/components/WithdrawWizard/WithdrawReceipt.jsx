import { Amount, ButtonLink, Card } from '@pooltogether/react-components'
import { numberWithCommas } from '@pooltogether/utilities'
import { formatUnits, parseUnits } from 'ethers/lib/utils'
import { NewPrizeCountdownInWords } from 'lib/components/NewPrizeCountdownInWords'
import Link from 'next/link'
import React from 'react'
import { useTranslation } from 'react-i18next'

export const WithdrawReceipt = (props) => {
  const {
    quantity,
    prevBalance,
    underlyingTokenSymbol,
    ticketDecimals,
    prizePeriodSeconds,
    prizePeriodStartedAt,
    isRngRequested
  } = props

  const balance = formatUnits(
    parseUnits(prevBalance, ticketDecimals).sub(parseUnits(quantity, ticketDecimals)),
    ticketDecimals
  )

  const { t } = useTranslation()

  return (
    <>
      <span className='text-xl mb-10 font-bold'>{t('successfullyWithdrew')}</span>
      <Card className='flex flex-col mx-auto mb-8' backgroundClassName='bg-orange-darkened'>
        <h1 className='text-orange'>
          <Amount>{numberWithCommas(quantity)}</Amount>
          <span>{underlyingTokenSymbol}</span>
        </h1>

        <div className='mb-4 text-orange text-sm'>
          <div className='mt-4'>
            {t('youNowHaveAmountTicketsInTheTickerPod', {
              amount: numberWithCommas(balance),
              ticker: underlyingTokenSymbol
            })}
          </div>
          <div className='mb-3 text-inverse'>
            {t('theNextPrizeWillBeAwardedIn')}
            <br />
            <div className='font-bold text-flashy'>
              <NewPrizeCountdownInWords
                prizePeriodSeconds={prizePeriodSeconds}
                prizePeriodStartedAt={prizePeriodStartedAt}
                isRngRequested={isRngRequested}
              />
            </div>
          </div>
        </div>
      </Card>
      <div className='mt-4'>
        <ButtonLink Link={Link} href='/account' as='/account' textSize='lg'>
          {t('viewYourAccount')}
        </ButtonLink>
      </div>
    </>
  )
}
