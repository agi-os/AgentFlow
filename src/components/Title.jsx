/**
 * Renders a title component with optional classNames, children, and id.
 * @param {Object} props - The component props.
 * @param {string[]} [props.classNames=['text-lg', 'font-thin', 'text-zinc-400', 'leading-none']] - The optional classNames for the title component.
 * @param {ReactNode} props.children - The children to be rendered within the title component.
 * @param {string} [props.id] - The optional id for the title component.
 * @returns {JSX.Element} The rendered title component.
 */
const Title = ({
  classNames = ['text-lg', 'font-thin', 'text-zinc-400', 'leading-none'],
  children,
  id,
}) => {
  return (
    <div className={classNames.join(' ')}>
      {children} {id && <sup>[{id}]</sup>}
    </div>
  )
}

export default Title
