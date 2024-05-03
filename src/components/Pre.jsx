/**
 * Renders a preformatted text block with customizable classNames.
 * @param {Object} props - The component props.
 * @param {string[]} [props.classNames] - An array of CSS class names to apply to the pre element.
 * @param {ReactNode} props.children - The content to be rendered inside the pre element.
 * @returns {JSX.Element} The rendered Pre component.
 */
import { useState } from 'react'

const Pre = ({
  classNames = [
    'text-[0.4rem]',
    'leading-none',
    'max-h-36',
    'max-w-60',
    'cursor-pointer',
  ],
  children,
}) => {
  const [isOverflowClip, setIsOverflowClip] = useState(true)

  const handleClick = () => {
    setIsOverflowClip(!isOverflowClip)
  }

  const overflowClass = isOverflowClip ? 'overflow-clip' : 'overflow-auto'
  const finalClassNames = [...classNames, overflowClass].join(' ')

  return (
    <pre className={finalClassNames} onClick={handleClick}>
      {JSON.stringify(children, null, 2)}
    </pre>
  )
}

export default Pre
