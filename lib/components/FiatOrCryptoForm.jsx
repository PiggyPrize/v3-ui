import React from 'react'
import { useRouter } from 'next/router'

import { Button } from 'lib/components/Button'
import { PaneTitle } from 'lib/components/PaneTitle'
import { queryParamUpdater } from 'lib/utils/queryParamUpdater'

export const FiatOrCryptoForm = (props) => {
  const { nextStep } = props

  const router = useRouter()
  const quantity = router.query.quantity

  const handleFiatClick = (e) => {
    e.preventDefault()

    queryParamUpdater.add(router, { method: 'fiat' })

    nextStep()
  }

  const handleCryptoClick = (e) => {
    e.preventDefault()

    queryParamUpdater.add(router, { method: 'crypto' })

    nextStep()
  }

  return <>
    <PaneTitle small>
      {quantity} tickets
    </PaneTitle>

    <PaneTitle>
      How would you like to deposit?
    </PaneTitle>

    <div className='flex flex-col mx-auto'>
      <Button
        onClick={handleFiatClick}
        color='green'
        className='my-2 w-64'
      >
        Fiat Currency
      </Button>

      <Button
        onClick={handleCryptoClick}
        color='white'
        className='my-2 w-64'
      >
        Crypto
      </Button>
    </div>
  </>
}
