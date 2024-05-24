const Input = ({
  classNames,
  inputClassNames = [],
  onChange,
  text = '',
  children,
}) => {
  return (
    <div className={classNames.join(' ')}>
      {children}
      <input
        className={inputClassNames.join(' ')}
        onChange={onChange}
        value={text}
      />
    </div>
  )
}

export default Input
