import { useCallback } from 'react'
import { useReactFlow } from '@xyflow/react'
import baseClassNames from '../../constants/classNames'
import Title from '../../components/Title'
import Inputs from '../../components/Inputs'

import { inputs } from './config'

import SignalHandles from '../../signals/SignalHandles/index'
import { BeltSource, BeltTarget } from '../../components/BeltPort'
import Semaphore from '../../components/Semaphore'
import useSelectedClassNames from '../../hooks/useSelectedClassNames'

import useAgent from './useAgent'
import TriggerLLMButton from './TriggerLLMButton'
import AutoRunButton from './AutoRunButton'
import ItemDetailsList from './ItemDetailsList'

// Functional component for the Item Details list

/**
 * Agent identity node
 * @param {string} id - Node ID
 * @param {object} data - Node data
 * @returns {JSX.Element}
 */
const AgentNode = ({ id, data }) => {
  const { updateNodeData } = useReactFlow()
  const selectedClassNames = useSelectedClassNames()
  const classNames = [...baseClassNames, ...selectedClassNames]

  const onChange = useCallback(
    ({ value, field }) => {
      updateNodeData(id, { [field]: value })
    },
    [id, updateNodeData]
  )

  const { triggerLLMCall, toggleAutoRun, autoRun, items } = useAgent({
    id,
    data,
  })

  const batchSize = parseInt(data.batchSize, 10) || 1
  const runEnabled = items.length >= batchSize

  return (
    <div className={classNames.join(' ')}>
      <Title id={id}>🧑‍💼 {data?.agentName ? data?.agentName : 'Agent'}</Title>
      <BeltTarget />
      <SignalHandles />
      <Semaphore />
      <Inputs inputs={inputs} data={data} onChange={onChange} />
      <div className="flex justify-between space-x-2">
        <TriggerLLMButton onClick={triggerLLMCall} enabled={runEnabled} />
        <AutoRunButton onClick={toggleAutoRun} autoRun={autoRun} />
      </div>
      <ItemDetailsList items={items} />
      <BeltSource />
    </div>
  )
}

export default AgentNode
