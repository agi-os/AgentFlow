const Input = ({
  classNames = [
    'w-full',
    'min-w-32',
    'p-2',
    'pl-3',
    'border',
    'border-zinc-700',
    'focus:border-zinc-500',
    'focus:bg-black',
    'focus:outline-none',
    'bg-zinc-900',
    'rounded-full',
    'nodrag',
  ],
  onChange,
  text = '',
}) => {
  return (
    <input className={classNames.join(' ')} onChange={onChange} value={text} />
  )
}

export default Input
