// Define possible grid configurations
export const GRID_CONFIGS = {
  '2x2': { rows: 'grid-rows-2', cols: 'grid-cols-2', size: 4 },
  '3x3': { rows: 'grid-rows-3', cols: 'grid-cols-3', size: 9 },
  '1x2': { rows: 'grid-rows-2', cols: 'grid-cols-1', size: 2 },
}

export const recipeInputClassNames = [
  'p-4',
  'm-1',
  'rounded',
  'shadow-inner',
  'shadow-zinc-900',
]

export const recipeInputHrClassNames = ['my-4', 'mx-1', 'border-zinc-700']

export const recipeInputGridClassNames = ['m-auto', 'grid', 'gap-2', 'w-fit']

export const inboxSlotsClassNames = [
  'flex',
  'flex-wrap',
  'items-center',
  'justify-start',
  'gap-1',
]

export const outputSlotsClassNames = [
  'flex',
  'flex-wrap',
  'items-center',
  'justify-evenly',
  'gap-1',
]

export const slotClassNames = [
  'border',
  'border-zinc-700',
  'rounded',
  'text-center',
  'w-8',
  'h-8',
  'leading-tight',
  'transition',
  'duration-200',
  'cursor-pointer',
  'hover:shadow-sm',
  'hover:shadow-zinc-600',
  'active:shadow-none',
  'relative',
]

export const craftingSlotClassNames = [
  ...slotClassNames,
  'flex',
  'items-center',
  'justify-center',
  'text-lg',
]

export const outlineTextShadow = [
  '#000 0.3px 0px 0px',
  '#000 -0.3px 0px 0px',
  '#000 -0.3px 0.3px 0px',
  '#000 0px 0.3px 0px',
  '#000 0px -0.3px 0px',
  '#000 0.3px 0.3px 0px',
  '#000 -0.3px 0.1px 0px',
  '#000 -0.1px -0.3px 0px',
  '#000 0.1px -0.3px 0px',
  '#000 0.3px -0.1px 0px',
].join(', ')
