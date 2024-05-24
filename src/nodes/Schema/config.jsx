export const baseClassNames = [
  'p-1',
  'rounded',
  'text-zinc-300',
  'font-thin',
  'w-32',
  'bg-zinc-800',
  'border-[1px]',
  'overflow-hidden',
  'overflow-visible',
  'border-zinc-700',
]

export const Schemas = ['URL', 'Article title', 'Web page text', 'Person']

export const schemaYaml = {
  URL: `properties:
url:
  type: string
  format: uri
required:
- url
`,
  'Article title': `properties:
title:
  type: string
  minLength: 3
required:
- title
`,
  'Web page text': `properties:
text:
  type: string
  minLength: 10
required:
- text
`,
  Person: `properties:
name:
  type: string
  minLength: 3
age:
  type: integer
  minimum: 18
required:
- name
- age
`,
}

export const schemaNodeClassNames = [
  'flex',
  'flex-col',
  'font-thin',
  'text-xs',
  'text-zinc-300',
  'gap-2',
  'pl-2',
  'pt-4',
]

export const textAreaClassNames = [
  'outline-none',
  'border-none',
  'mt-2',
  'p-2',
  'w-full',
  'text-nowrap',
  'font-mono',
  'text-zinc-500',
  'rounded-t',
  'rounded-b-sm',
  'bg-zinc-800',
  'border-none',
  'resize-none',
  'overflow-hidden',
  'text-[0.5rem]',
  'leading-none',
  'h-[7.2rem]',
  'shadow-inner',
  'transition-all',
  'shadow-zinc-900',
  'focus-visible:shadow-zinc-600',
  'focus-visible:outline-none',
  'focus-visible:text-zinc-200',
]

export const labelClassNames = [
  'flex',
  'items-center',
  'gap-2',
  'cursor-pointer',
]
