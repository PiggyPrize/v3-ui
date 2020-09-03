import React, { useState } from 'react'
import classnames from 'classnames'
import FeatherIcon from 'feather-icons-react'
import {
  Menu,
  MenuList,
  MenuButton,
  MenuItem,
} from '@reach/menu-button'

export const DropdownInputGroup = (props) => {
  const {
    id,
    formatValue,
    values,
    current,
    onValueSet
  } = props

  let label = props.label || 'Dropdown'

  const [currentValue, setCurrentValue] = useState(current ? current : '')

  const handleChangeValueClick = (newValue) => {
    setCurrentValue(newValue)
    onValueSet()
  }

  let valuesArray = []
  if (typeof values === 'object') {
    console.log(Object.keys(values))

    valuesArray = Object.keys(values).map(v => v)
  }
  console.log(valuesArray)

  const menuItems = valuesArray.map(valueItem => {
    let value = valueItem

    // let valueObject
    // if (typeof values === 'object') {
    //   valueObject = values[value]
    // }

    const selected = value === currentValue

    return <MenuItem
      key={`${id}-value-picker-item-${value}`}
      onSelect={() => { handleChangeValueClick(value) }}
      className={classnames(
        {
          selected
        }
      )}
    >
      {formatValue ? formatValue(value) : value}
    </MenuItem>
  })

  return <>
    <Menu>
      {({ isExpanded }) => (
        <>
          <MenuButton
            className={classnames(
              'inline-flex items-center justify-center trans ml-8 xs:ml-6 sm:ml-6 mr-2 sm:mr-4 my-2 hover:text-inverse font-bold inline-block text-xxs sm:text-base text-lg',
              {
                'text-highlight-2': !isExpanded,
                'text-highlight-1': isExpanded,
              }
            )}
            style={{
              minWidth: 50
            }}
          >
            {label ? label : currentValue.toUpperCase()} <FeatherIcon
              icon={isExpanded ? 'chevron-up' : 'chevron-down'}
              className='relative w-4 h-4 inline-block ml-2'
              strokeWidth='0.15rem'
            />
          </MenuButton>

          <MenuList>
            {menuItems}
          </MenuList>
        </>
      )}
    </Menu>

  </>
}