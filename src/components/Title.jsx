import { useNodeId } from '@xyflow/react'
import IdBadge from './IdBadge/index'
import Semaphore from './Semaphore'

/**
 * Renders a title component with optional classNames, children, and id.
 * @param {Object} props - The component props.
 * @param {string[]} [props.classNames=['text-lg', 'font-thin', 'text-zinc-400', 'leading-none']] - The optional classNames for the title component.
 * @param {ReactNode} props.children - The children to be rendered within the title component.
 * @param {string} [props.id] - The optional id for the title component.
 * @returns {JSX.Element} The rendered title component.
 */
const Title = ({
  classNames = ['text-lg', 'font-thin', 'text-zinc-400', 'leading-none', 'p-2'],
  children,
}) => {
  const nodeId = useNodeId()

  return (
    <>
      <IdBadge id={nodeId} key="badge">
        {nodeId}
      </IdBadge>
      <Semaphore />
      <div x-node-id={nodeId} key="title" className={classNames.join(' ')}>
        {children}
      </div>
    </>
  )
}

export default Title
