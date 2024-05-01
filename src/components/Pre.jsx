const Input = ({
  classNames = [
    'text-xs',
    'leading-none',
    'overflow-auto',
    'max-h-36',
    'max-w-xl',
  ],
  children,
}) => {
  return (
    <pre className={classNames.join(' ')}>
      {JSON.stringify(children, null, 2)}
    </pre>
  )
}

export default Input
