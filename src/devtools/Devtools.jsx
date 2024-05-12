import { useState } from 'react'
import { Panel } from '@xyflow/react'

import NodeInspector from './NodeInspector'
import ChangeLogger from './ChangeLogger'
import ViewportLogger from './ViewportLogger'

/**
 * @typedef {Object} DevToolButtonProps
 * @property {boolean} active
 * @property {React.Dispatch<React.SetStateAction<boolean>>} setActive
 * @property {React.ReactNode} children
 * @property {Object} rest
 */

/**
 * @param {DevToolButtonProps} props
 */
const DevToolButton = ({ active, setActive, children, ...rest }) => {
  const classNames = [
    active ? 'bg-zinc-600' : 'bg-zinc-800',
    active ? 'text-white' : 'text-zinc-600',
    'px-3',
    'py-1',
    'mt-2',
    'rounded-full',
  ]

  return (
    <button
      className={classNames.join(' ')}
      onClick={() => setActive(a => !a)}
      {...rest}>
      {children}
    </button>
  )
}

const DevTools = () => {
  const [nodeInspectorActive, setNodeInspectorActive] = useState(true)
  const [changeLoggerActive, setChangeLoggerActive] = useState(true)
  const [viewportLoggerActive, setViewportLoggerActive] = useState(false)

  return (
    <div className="react-flow__devtools">
      <Panel position="top-left" className="pt-12 gap-3 flex">
        <DevToolButton
          setActive={setNodeInspectorActive}
          active={nodeInspectorActive}
          title="Toggle Node Inspector">
          Node Inspector
        </DevToolButton>
        <DevToolButton
          setActive={setChangeLoggerActive}
          active={changeLoggerActive}
          title="Toggle Change Logger">
          Change Logger
        </DevToolButton>
        <DevToolButton
          setActive={setViewportLoggerActive}
          active={viewportLoggerActive}
          title="Toggle Viewport Logger">
          Viewport Logger
        </DevToolButton>
      </Panel>
      {changeLoggerActive && <ChangeLogger />}
      {nodeInspectorActive && <NodeInspector />}
      {viewportLoggerActive && <ViewportLogger />}
    </div>
  )
}

export default DevTools
