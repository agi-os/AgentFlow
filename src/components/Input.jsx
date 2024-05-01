const Input = ({
  classNames = [
    'w-full',
    'min-w-32',
    'p-1',
    'border',
    'border-[#222]',
    'bg-[#111]',
    'rounded',
    'nodrag',
  ],
  updateText,
  text,
}) => {
  return (
    <input
      className={classNames.join(' ')}
      onChange={event => updateText(event.target.value)}
      value={text}
    />
  )
}

export default Input
