const Title = ({
  classNames = ['text-xl', 'font-thin', 'text-gray-200', 'leading-none'],
  children,
  id,
}) => {
  return (
    <h1 className={classNames.join(' ')}>
      {children} <sup>[{id}]</sup>
    </h1>
  )
}

export default Title
