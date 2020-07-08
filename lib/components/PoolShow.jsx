import React, { useContext, useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { Button } from 'lib/components/Button'
import { EtherscanAddressLink } from 'lib/components/EtherscanAddressLink'
import { FormLockedOverlay } from 'lib/components/FormLockedOverlay'
import { LoadingDots } from 'lib/components/LoadingDots'
import { CurrencyAndYieldSource } from 'lib/components/CurrencyAndYieldSource'
import { DepositWizard } from 'lib/components/DepositWizard'
import { PoolActionsUI } from 'lib/components/PoolActionsUI'
import { PrizeAmount } from 'lib/components/PrizeAmount'
import { UserActionsUI } from 'lib/components/UserActionsUI'
import { UserStats } from 'lib/components/UserStats'
import { useInterval } from 'lib/hooks/useInterval'
import { fetchChainData } from 'lib/utils/fetchChainData'
import { poolToast } from 'lib/utils/poolToast'

const renderErrorMessage = (
  address,
  type,
  message
) => {
  const errorMsg = `Error fetching ${type} for prize pool with address: ${address}: ${message}. (maybe wrong Ethereum network?)`

  console.error(errorMsg)
  poolToast.error(errorMsg)
}

export const PoolShow = (
  props,
) => {
  const router = useRouter()
  const { pool } = props

  const authControllerContext = useContext(AuthControllerContext)
  const { ethBalance, usersAddress, provider } = authControllerContext
  
  let error
  
  try {
    ethers.utils.getAddress(pool.id)
  } catch (e) {
    error = 'Incorrectly formatted Ethereum address!'
  }
  
  const networkName = router.query.networkName

  const [poolAddresses, setPoolAddresses] = useState({})
  const [genericChainValues, setGenericChainValues] = useState({
    loading: true,
    tokenSymbol: 'TOKEN',
    poolTotalSupply: '1234',
  })

  const [usersChainValues, setUsersChainValues] = useState({
    loading: true,
    usersTicketBalance: ethers.utils.bigNumberify(0),
    usersTokenAllowance: ethers.utils.bigNumberify(0),
    usersTokenBalance: ethers.utils.bigNumberify(0),
  })


  useInterval(() => {
    fetchChainData(
      networkName,
      usersAddress,
      poolAddresses,
      setPoolAddresses,
      setGenericChainValues,
      setUsersChainValues,
    )
  }, 7777)

  useEffect(() => {
    fetchChainData(
      networkName,
      usersAddress,
      poolAddresses,
      setPoolAddresses,
      setGenericChainValues,
      setUsersChainValues,
    )
  }, [provider, usersAddress, poolAddresses])

  // useEffect(() => {
  //   if (ethBalance) {
  //     setEthBalance(ethers.utils.bigNumberify(ethBalance))
  //   }
  // }, [authControllerContext])

  if (poolAddresses.error || genericChainValues.error || usersChainValues.error) {
    if (poolAddresses.error) {
      renderErrorMessage(prizePool, 'pool addresses', poolAddresses.errorMessage)
    }

    if (genericChainValues.error) {
      renderErrorMessage(prizePool, 'generic chain values', genericChainValues.errorMessage)
    }

    if (usersChainValues.error) {
      renderErrorMessage(prizePool, `user's chain values`, usersChainValues.errorMessage)
    }

    // router.push(
    //   `/`,
    //   `/`,
    //   {
    //     shallow: true
    //   }
    // )
  }

  // const tokenSvg = genericChainValues.tokenSymbol === 'DAI' ?
  //   DaiSvg :
  //   genericChainValues.tokenSymbol === 'USDC' ?
  //     UsdcSvg :
  //     UsdtSvg

  if (!pool) {
    // console.warn("don't do this!")
    return null
  }

  const handleShowGetTickets = (e) => {
    e.preventDefault()

    router.push(
      `${router.pathname}?getTickets=1`,
      `${router.asPath}?getTickets=1`, {
        shallow: true
      }
    )
  }

  const getTickets = router.query.getTickets

  return <>
    <motion.div
      // layoutId={`pool-container-${poolId}`}
      initial='initial'
      animate='enter'
      exit='exit'
      variants={{
        exit: {
          scale: 0.9,
          y: 10,
          opacity: 0,
          transition: {
            duration: 0.5,
            staggerChildren: 0.1
          }
        },
        enter: {
          transition: {
            duration: 0.5,
            staggerChildren: 0.1
          }
        },
        initial: {
          y: 0,
          opacity: 1,
          transition: {
            duration: 0.2
          }
        }
      }}
    >
      {error}

      {getTickets && <DepositWizard
        {...props}
        genericChainValues={genericChainValues}
        usersChainValues={usersChainValues}
        poolAddresses={poolAddresses}
      />}
      
        {/* {genericChainValues.loading ?
          <div
            className='text-center text-xl'
          >
            <LoadingDots />
            <br/>
            Fetching chain values ...
          </div> */}
        <>
          <div
            className='px-2 py-4 sm:py-2 text-center rounded-lg'
          >
            <div
              className='flex flex-col sm:flex-row justify-between items-center'
            >
              <div
                className='flex items-center w-full sm:w-1/2'
              >
                <div
                  className='inline-block text-left text-lg sm:text-xl font-bold'
                >
                  {pool.frequency} Pool
                </div>

                <div
                  className='inline-flex items-center ml-4'
                >
                  <CurrencyAndYieldSource
                    {...props}
                  />
                </div>
              </div>

              <div
                className='flex sm:justify-end items-center w-full sm:w-1/2 mt-4 sm:mt-0'
              >
                <Button
                  onClick={handleShowGetTickets}
                  wide
                >
                  Get tickets
                </Button>
                <div
                  className='ml-2'
                >
                  <Button inversed>
                    Withdraw
                  </Button>
                </div>
                {/* <DepositUI
                  {...props}
                  genericChainValues={genericChainValues}
                /> */}
              </div>

            </div>

            {/* <img
              src={tokenSvg}
              className='inline-block w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 mb-2'
            /> */}
            
            {/* <div
              className='mb-6'
            >
              Prize Pool contract address:
              <br /> <EtherscanAddressLink
                address={poolAddresses.prizePool}
                networkName={networkName}
              >
                {poolAddresses.prizePool}
              </EtherscanAddressLink>
            </div> */}

            <div className='text-left mt-10'>
              <PrizeAmount
                {...props}
                big
              />
            </div>

            <div className='mt-10'>
              <PoolActionsUI
                genericChainValues={genericChainValues}
                networkName={networkName}
                poolAddresses={poolAddresses}
                usersAddress={usersAddress}
              />
            </div>
          </div>

          <div
            className='relative py-4 sm:py-2 text-center rounded-lg'
          >
            {/* {ethBalance && ethBalance.eq(0) && <>
              <FormLockedOverlay
                flexColJustifyClass='justify-start'
                title={`Deposit & Withdraw`}
                zLayerClass='z-30'
              >
                <>
                  Your ETH balance is 0.
                  <br />To interact with the contracts you will need ETH.
                </>
              </FormLockedOverlay>
            </>} */}


            {/* {!usersAddress && <FormLockedOverlay
              flexColJustifyClass='justify-start'
              title={`Deposit & Withdraw`}
              zLayerClass='z-30'
            >
              <>
                <div>
                  To interact with the contracts first connect your wallet:
                </div>

                <div
                  className='mt-3 sm:mt-5 mb-5'
                >
                  <button
                  className='rounded-lg text-secondary border sm:border-2 border-secondary hover:text-white hover:bg-secondary text-xxs sm:text-base py-2 px-3 sm:px-6 trans  tracking-wider'
                    onClick={handleConnect}
                  >
                    Sign in
                  </button>
                </div>
              </>
            </FormLockedOverlay>} */}
            

            {usersAddress && <UserStats
              genericChainValues={genericChainValues}
              usersChainValues={usersChainValues}
            />}
{/* 
            <UserActionsUI
              genericChainValues={genericChainValues}
              poolAddresses={poolAddresses}
              usersChainValues={usersChainValues}
            /> */}
          </div>
        </>
        {/* } */}
      </motion.div>
  </>
}
