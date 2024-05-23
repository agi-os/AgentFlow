export const inputs = [
  {
    label: 'Short and direct description of what to do (task)',
    field: 'systemPrompt',
    defaultValue:
      'Write a list with short bullet points what these items have in common',
  },
  {
    label: 'Item count to use per task (batch size)',
    field: 'batchSize',
    defaultValue: '3',
  },
  {
    label: 'The shape of the output (schema)',
    field: 'outputSchema',
    defaultValue: 'markdown',
  },
  {
    label: 'Emoji of output items',
    field: 'outputEmoji',
    defaultValue: '✨',
  },
  {
    label: 'Type of output items',
    field: 'outputType',
    defaultValue: 'ai',
  },
]
