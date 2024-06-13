import { inputClassNames } from '../../constants/classNames'

export const inputs = [
  {
    label: 'Search engine',
    field: 'domain',
    defaultValue: 'yandex.com',
    classNames: ['col-span-12'],
    inputClassNames,
  },
  {
    label: 'Search term',
    field: 'query',
    defaultValue: 'is tomato a fruit',
    classNames: ['col-span-12'],
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
