import Semaphore from '../../components/Semaphore'
import SignalHandles from '../../signals/SignalHandles'

import Title from '../../components/Title'
import { baseClassNames } from './baseClassNames'
import useSelectedClassNames from '../../hooks/useSelectedClassNames'

const Schemas = ['URL', 'Article title', 'Web page text', 'Person']

const SchemaNode = ({ id, data }) => {
  // Prepare the class names based on the selected state
  const selectedClassNames = useSelectedClassNames()

  // Collapse the node if the semaphore is red as schema will not apply
  const semaphoreClass = data.semaphore === 'red' ? 'h-8' : 'h-36'

  // Combine the base and selected class names
  const classNames = [...baseClassNames, ...selectedClassNames, semaphoreClass]

  return (
    <div x-id={id} className={classNames.join(' ')}>
      <Title id={id}>🧬 Schema</Title>
      <SignalHandles />
      <Semaphore colors={['red', 'blue']} />
      {data.semaphore !== 'red' && (
        <div className="flex flex-col font-thin text-xs text-zinc-300 gap-2 pl-2 pt-4">
          {Schemas.map(schema => (
            <label key={schema} className="flex items-center gap-2">
              <input type="radio" value={schema} name="format" />
              <div>{schema}</div>
            </label>
          ))}
        </div>
      )}
    </div>
  )
}

export default SchemaNode
