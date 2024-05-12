import { useState, useEffect, useRef } from 'react'
import { useStore, useStoreApi } from '@xyflow/react'

/**
 * @typedef {Object} ChangeInfoProps
 * @property {Object} change
 * @property {string} change.type
 * @property {Object} change.item
 * @property {Object} change.dimensions
 * @property {Object} change.position
 * @property {boolean} change.selected
 */

/**
 * @param {ChangeInfoProps} props
 */
const ChangeInfo = ({ change }) => {
  const { type } = change

  return (
    <div className="react-flow__devtools-changeinfo">
      <div className="react-flow__devtools-changeinfo-type">{type}</div>
      <div className="react-flow__devtools-changeinfo-data">
        {type === 'add' ? JSON.stringify(change.item, null, 2) : null}
        {type === 'dimensions'
          ? `dimensions: ${change.dimensions?.width} × ${change.dimensions?.height}`
          : null}
        {type === 'position'
          ? `position: ${change.position?.x.toFixed(
              1
            )}, ${change.position?.y.toFixed(1)}`
          : null}
        {type === 'remove' ? 'remove' : null}
        {type === 'select' ? (change.selected ? 'select' : 'unselect') : null}
      </div>
    </div>
  )
}

/**
 * @typedef {Object} ChangeLoggerProps
 * @property {number} limit
 */

/**
 * @param {ChangeLoggerProps} props
 */
const ChangeLogger = ({ limit = 20 }) => {
  const [changes, setChanges] = useState([])
  const onNodesChangeIntercepted = useRef(false)
  const onNodesChange = useStore(s => s.onNodesChange)
  const store = useStoreApi()

  useEffect(() => {
    if (!onNodesChange || onNodesChangeIntercepted.current) {
      return
    }

    onNodesChangeIntercepted.current = true
    const userOnNodesChange = onNodesChange

    const onNodesChangeLogger = changes => {
      userOnNodesChange(changes)

      setChanges(oldChanges => [...changes, ...oldChanges].slice(0, limit))
    }

    store.setState({ onNodesChange: onNodesChangeLogger })
  }, [onNodesChange, limit, store])

  return (
    <div className="react-flow__devtools-changelogger">
      <div className="react-flow__devtools-title">Change Logger</div>
      {changes.length === 0 ? (
        <>no changes triggered</>
      ) : (
        changes.map((change, index) => (
          <ChangeInfo key={index} change={change} />
        ))
      )}
    </div>
  )
}

export default ChangeLogger
