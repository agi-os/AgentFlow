import { useCallback } from 'react'
import { useReactFlow } from '@xyflow/react'
import baseClassNames from '../../constants/classNames'
import Title from '../../components/Title'
import Inputs from '../../components/Inputs'

import agentPresets from '../presets/agents.json'

import SignalHandles from '../../signals/SignalHandles/index'
import { BeltSource, BeltTarget } from '../../components/BeltPort'
import Semaphore from '../../components/Semaphore'
import useSelectedClassNames from '../../hooks/useSelectedClassNames'

/**
 * Agent identity node
 * @param {string} id - Node ID
 * @param {object} data - Node data
 * @returns {JSX.Element}
 */
const AgentNode = ({ id, data }) => {
  const { updateNodeData } = useReactFlow()

  // Prepare the class names based on the selected state
  const selectedClassNames = useSelectedClassNames()

  // Combine the base and selected class names
  const classNames = [...baseClassNames, ...selectedClassNames]

  const handleSelect = event => {
    const agent = agentPresets.find(
      agent => agent.agentName === event.target.value
    )

    if (!agent) return

    updateNodeData(id, {
      agentName: agent.agentName,
      agentDescription: agent.agentDescription,
      tools: agent.tools,
    })
  }

  const onChange = useCallback(
    ({ value, field }) => {
      updateNodeData(id, { [field]: value })
    },
    [id, updateNodeData]
  )

  const inputs = [
    { label: 'Name', field: 'agentName' },
    { label: 'Description', field: 'agentDescription' },
    { label: 'Tools', field: 'tools' },
  ]

  return (
    <div className={classNames.join(' ')}>
      <Title id={id}>🧑‍💼 {data?.agentName ? data?.agentName : 'Agent'}</Title>
      <BeltTarget />
      <SignalHandles />
      <Semaphore />
      <div className="pl-2 -mb-3 text-slate-300 text-xs">Presets</div>
      <select
        value={data.agentName}
        className="appearance-none  bg-zinc-900 text-white rounded-full p-2 pl-3 border border-zinc-700 outline-none"
        onChange={handleSelect}>
        <option value="">Select a preset</option>
        {agentPresets.map((agent, index) => (
          <option key={index} value={agent.agentName}>
            {agent.agentName}
          </option>
        ))}
      </select>
      <Inputs inputs={inputs} data={data} onChange={onChange} />

      <BeltSource />
    </div>
  )
}

export default AgentNode
