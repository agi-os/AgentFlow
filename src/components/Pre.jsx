const Input = ({
  classNames = [
    'text-[0.4rem]',
    'leading-none',
    'overflow-auto',
    'max-h-36',
    'max-w-60',
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
