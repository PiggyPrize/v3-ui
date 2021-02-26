import React from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/router'

import { BANNER_LIST_VARIANTS, POOL_LIST_TABS } from 'lib/constants'
import { useTranslation } from 'lib/../i18n'
import { useReducedMotion } from 'lib/hooks/useReducedMotion'
import { usePools } from 'lib/hooks/usePools'
import { CommunityDisclaimerBanner } from 'lib/components/CommunityDisclaimerBanner'
import { IndexUILoader } from 'lib/components/IndexUILoader'
import { PoolList } from 'lib/components/PoolList'
import { RetroactivePoolClaimBanner } from 'lib/components/RetroactivePoolClaimBanner'
import { Tagline } from 'lib/components/Tagline'
import { TVLAndWeeklyPrizesBanner } from 'lib/components/TVLAndWeeklyPrizesBanner'

import CompSvg from 'assets/images/comp.svg'

const BannerMotionDIV = (props) => {
  const shouldReduceMotion = useReducedMotion()

  return <motion.div
    {...props}
    className='flex flex-col justify-center items-center text-xs sm:text-lg lg:text-xl'
    variants={BANNER_LIST_VARIANTS(shouldReduceMotion)}
    initial={{
      scale: 0,
      opacity: 0,
    }}
  >
    {props.children}
  </motion.div>
}

export const IndexUI = (props) => {
  const { poolsDataLoading, pools, communityPools } = usePools()
  
  const router = useRouter()
  const selectedTab = router.query.tab || POOL_LIST_TABS.pools

  return (
    <>
      <RetroactivePoolClaimBanner />

      <div className='relative h-40'>
        <div className='absolute t-0 l-0 r-0'>
          <AnimatePresence exitBeforeEnter>
            <BannerMotionDIV
              key='tvl-banner'
              animate={selectedTab === POOL_LIST_TABS.pools ? 'enter' : 'exit'}
            >
              <TVLAndWeeklyPrizesBanner />
            </BannerMotionDIV>
          </AnimatePresence>
          <AnimatePresence exitBeforeEnter>
            <BannerMotionDIV
              key='community-disclaimer-banner'
              animate={selectedTab === POOL_LIST_TABS.community ? 'enter' : 'exit'}
            >
              <CommunityDisclaimerBanner />
            </BannerMotionDIV>
          </AnimatePresence>
        </div>

      </div>

      {/* <NewPoolBanner /> */}

      <div className='mt-10'>
        {poolsDataLoading ? <IndexUILoader /> : <PoolList pools={pools} communityPools={communityPools} />}
      </div>

      <Tagline />
    </>
  )
}

const NewPoolBanner = (props) => {
  const { t } = useTranslation()

  return <Link href='/pools/[symbol]' as={`/pools/PT-cCOMP`}>
    <a className='block mt-2 mb-3 text-center p-3 rounded-lg border-2 border-secondary font-bold text-inverse text-xxs xs:text-xs sm:text-sm'>
      <span role='img' aria-label='megaphone emoji' className='mx-2 text-xl'>
        📣
      </span>
      <br />{' '}
      <img
        src={CompSvg}
        alt='comp logo'
        className='w-4 h-4 inline-block relative'
        style={{
          top: -2,
        }}
      />{' '}
      {t('tickerPoolIsNowOpen', {
        ticker: 'COMP',
      })}
    </a>
  </Link>
}
