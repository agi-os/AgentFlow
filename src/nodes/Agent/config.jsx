import { inputClassNames } from '../../constants/classNames'

export const inputs = [
  {
    label: 'Short and direct description of what to do (task)',
    field: 'systemPrompt',
    defaultValue:
      'Write a list with short bullet points what these items have in common',
    classNames: ['col-span-12'],
    inputClassNames,
  },
  {
    label: '# of items to use',
    field: 'batchSize',
    defaultValue: '3',
    classNames: ['col-span-4'],
    inputClassNames,
  },
  {
    label: 'Expected shape of the output (schema)',
    field: 'outputSchema',
    defaultValue: 'markdown',
    classNames: ['col-span-8'],
    inputClassNames,
  },
  {
    label: 'Emoji of output items',
    field: 'outputEmoji',
    defaultValue: '✨',
    classNames: ['col-span-4'],
    inputClassNames,
  },
  {
    label: 'Type of output items',
    field: 'outputType',
    defaultValue: 'ai',
    classNames: ['col-span-8'],
    inputClassNames,
  },
]
