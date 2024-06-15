import { inputClassNames } from '../../constants/classNames'

export const inputs = [
  {
    label: 'Search engine',
    field: 'domain',
    defaultValue: 'etools.ch',
    classNames: ['col-span-12'],
    inputClassNames,
  },
  {
    label: 'Search term',
    field: 'query',
    defaultValue: 'safe and aligned ethical unicorns',
    classNames: ['col-span-12'],
    inputClassNames,
  },
  {
    label: 'Value we are listening for',
    field: 'placeholder',
    defaultValue: 'safe and aligned ethical unicorns',
    classNames: ['col-span-6'],
    inputClassNames,
  },
  {
    label: 'New value to replace the one listened for',
    field: 'value',
    defaultValue: 'how is babby formed?',
    classNames: ['col-span-6'],
    inputClassNames,
  },
  {
    label: 'Emoji of output items',
    field: 'outputEmoji',
    defaultValue: '🔗',
    classNames: ['col-span-4'],
    inputClassNames,
  },
  {
    label: 'Type of output items',
    field: 'outputType',
    defaultValue: 'link',
    classNames: ['col-span-8'],
    inputClassNames,
  },
]
