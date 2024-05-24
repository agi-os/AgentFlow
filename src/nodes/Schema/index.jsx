import Semaphore from '../../components/Semaphore'
import SignalHandles from '../../signals/SignalHandles'
import Title from '../../components/Title'
import Editor from './Editor'
import Selector from './Selector'
import { baseClassNames } from './config'
import useSelectedClassNames from '../../hooks/useSelectedClassNames'

/**
 * Renders a schema node component with given id and data.
 * Applies selected class names and semaphore class based on data.
 * If semaphore is red, displays a larger semaphore component.
 * If semaphore is not red, displays a selector and an editor component.
 *
 * @param {string} id - The unique identifier for the schema node.
 * @param {object} data - The data object containing information about the schema node.
 *
 * @returns {JSX.Element} A React component representing the schema node.
 */
const SchemaNode = ({ id, data }) => {
  const selectedClassNames = useSelectedClassNames()
  const semaphoreClass = data.semaphore === 'red' ? 'h-8' : 'h-64'
  const classNames = [...baseClassNames, ...selectedClassNames, semaphoreClass]

  return (
    <div x-id={id} className={classNames.join(' ')}>
      <Title id={id}>🧬 Schema</Title>
      <Semaphore colors={['red', 'blue']} />
      {data.semaphore !== 'red' && (
        <>
          <Selector id={id} data={data} />
          <Editor id={id} data={data} />
        </>
      )}
      <SignalHandles />
    </div>
  )
}

export default SchemaNode
