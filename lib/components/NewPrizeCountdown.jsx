import React, { useEffect, useState } from 'react'
import classnames from 'classnames'
import addSeconds from 'date-fns/addSeconds'
import { useInterval } from 'beautiful-react-hooks'

import { useTranslation } from 'lib/../i18n'
// import { formatFutureDateInSeconds } from 'lib/utils/formatFutureDateInSeconds'
import { subtractDates } from 'lib/utils/subtractDates'

const ONE_SECOND = 1000

export const NewPrizeCountdown = (
  props,
) => {
  const { t } = useTranslation()
  const { pool, center, textAlign, textSize } = props
  let flashy = props.flashy === false ? false : true

  const [secondsRemaining, setSecondsRemaining] = useState(null)

  // console.log('a', pool?.prizePeriodRemainingSeconds?.toString())

  // const secs = 167868
  const secs = pool?.prizePeriodRemainingSeconds &&
    parseInt(pool?.prizePeriodRemainingSeconds.toString(), 10)

  useEffect(() => {
    setSecondsRemaining(secs)
  }, [secs])

  useInterval(() => {
    setSecondsRemaining(secondsRemaining - 1)
  }, ONE_SECOND)

  if (!pool || secs === undefined) {
    return null
  }

  const currentDate = new Date(Date.now())
  const futureDate = addSeconds(currentDate, secondsRemaining)
  const { days, hours, minutes, seconds } = subtractDates(futureDate, currentDate)

  let msg
  if (pool?.isRngRequested) {
    return <>
      <p
        className={classnames(
          textSize,
          'font-bold',
          {
            'text-flashy': flashy,
            'text-xs xs:text-sm sm:text-xl': !textSize,
            'text-right': !textAlign
          }
        )}
      >
        {t('prizeIsBeingAwarded')}
      </p>
    </>
  }

  const daysArray = ('' + days).split('')
  const hoursArray = ('' + hours).split('')
  const minutesArray = ('' + minutes).split('')
  const secondsArray = ('' + seconds).split('')

  // 3600 seconds = 1 hour
  const textColor = secondsRemaining >= 3600 ?
    'green' :
    secondsRemaining >= 600 ?
      'orange' :
      'red'

  const LeftSideJsx = ({ digit }) => {
    return <span
      className={`bg-tertiary text-${textColor} font-bold rounded-sm`}
      style={{
        padding: '2px 8px',
        margin: '0 1px'
      }}
    >
      {digit}
    </span>
  }

  const RightSideJsx = ({ digit }) => {
    return <span
      className={`bg-tertiary text-${textColor} font-bold rounded-sm`}
      style={{
        padding: '2px 8px',
        margin: '0 1px'
      }}
    >
      {digit}
    </span>
  }

  const unitClasses = 'opacity-60 text-inverse text-xxs xs:text-xs sm:text-xs pt-1'
  
  return <>
    <div
      className={classnames(
        textSize,
        'flex text-center',
        {
          'justify-center': center,
          'text-sm xs:text-xs sm:text-base lg:text-xl': !textSize,
        }
      )}
    >
      <div
        className='flex flex-col sm:mr-2'
        style={{
          paddingLeft: 2,
          paddingRight: 2,
        }}
      >
        <div className='flex'>
          <LeftSideJsx
            digit={daysArray.length < 2 ? 0 : daysArray[0]}
          />
          <RightSideJsx
            digit={daysArray.length > 1 ? daysArray[1] : daysArray[0]}
          />
        </div>
        <div className={unitClasses}>
          {t('countdownDayShort')}
        </div>
      </div>
      <div
        className='flex flex-col'
        style={{
          paddingLeft: 2,
          paddingRight: 2,
        }}
      >
        <div className='flex'>
          <LeftSideJsx
            digit={hoursArray.length < 2 ? 0 : hoursArray[0]}
          />
          <RightSideJsx
            digit={hoursArray.length > 1 ? hoursArray[1] : hoursArray[0]}
          />
        </div>
        <div className={unitClasses}>
          {t('countdownHourShort')}
        </div>
      </div>
      <div
        className={`px-0 sm:px-1 font-bold text-${textColor}`}
      >
        :
      </div>
      <div
        className='flex flex-col'
        style={{
          paddingLeft: 1,
          paddingRight: 2,
        }}
      >
        <div className='flex'>
          <LeftSideJsx
            digit={minutesArray.length < 2 ? 0 : minutesArray[0]}
          />
          <RightSideJsx
            digit={minutesArray.length > 1 ? minutesArray[1] : minutesArray[0]}
          />
        </div>
        <div className={unitClasses}>
          {t('countdownMinuteShort')}
        </div>
      </div>
      <div
        className={`px-0 sm:px-1 font-bold text-${textColor}`}
      >
        :
      </div>
      <div
        className='flex flex-col'
        style={{
          paddingLeft: 1,
          paddingRight: 2,
        }}
      >
        <div className='flex'>
          <LeftSideJsx
            digit={secondsArray.length < 2 ? 0 : secondsArray[0]}
          />
          <RightSideJsx
            digit={secondsArray.length > 1 ? secondsArray[1] : secondsArray[0]}
          />
        </div>
        <div className={unitClasses}>
          {t('countdownSecondShort')}
        </div>
      </div>
      {msg}
    </div>
  </>
}
