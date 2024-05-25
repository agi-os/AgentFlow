import Title from '../../components/Title'
import SignalHandles from '../../signals/SignalHandles/index'
import { BeltSource, BeltTarget } from '../../components/BeltPort'
import ZoomCompensated from '../ZoomCompensated/index'
import Semaphore from '../../components/Semaphore'

import ZoomResponsiveWrapper from '../ZoomCompensated/ZoomResponsiveWrapper'
import { reverseToolSchema } from './reverseToolSchema'

import { useStore } from '@xyflow/react'

import Countdown from '../ItemChest/Countdown'
import baseClassNames from '../ItemChest/classNames'

import useSelectedClassNames from '../../hooks/useSelectedClassNames'
import { useEffect, useCallback, useState } from 'react'

import Item from '../../components/Item'
import ChestBody from './ChestBody'

/**
 * Renders a Chest node component.
 * @param {Object} props - The component props.
 * @param {string} props.id - The unique identifier of the Chest node.
 * @param {Object} props.data - The data associated with the Chest node.
 * @returns {JSX.Element} The rendered Chest node component.
 */
const ToolChestNode = ({ id }) => {
  // Get the websocket connection from the store
  const socket = useStore(s => s.socket)

  const [isSocketReady, setIsSocketReady] = useState(false)

  useEffect(() => {
    // Check if socket is available and set state
    if (socket && socket.emit) {
      setIsSocketReady(true)
    } else {
      const timer = setTimeout(() => {
        setIsSocketReady(false) // Trigger re-check
      }, 2000) // Retry after 2 seconds

      return () => clearTimeout(timer) // Cleanup timeout on component unmount
    }
  }, [isSocketReady, socket]) // Dependency array includes isSocketReady to re-run effect when it changes

  // Get the setItem function
  const setItem = useStore(s => s.setItem)

  // Get ids of all items in the location
  const itemIds = useStore(state =>
    state.getLocationItems(id).map(item => item.id)
  )
  const itemCount = itemIds.length

  // Get the selected class names
  const selectedClassNames = useSelectedClassNames()

  // Combine the base and selected class names
  const classNames = [...baseClassNames, ...selectedClassNames]

  // Call emit when isSocketReady changes to true
  useEffect(() => {
    // If tool chest is not empty we're done
    if (itemCount > 0) return

    // If socket is unavailable, try later
    if (!isSocketReady) return

    // Fetch the tool schemas from the server
    socket?.emit('toolSchemas', tools => {
      const data = tools.map(tool => reverseToolSchema(tool))

      for (const item of data) {
        item.type = 'tool'
        item.emoji = '🛠️'

        // Assign the item's location to this node
        item.location = { id, distance: 0 }

        // Emit the item
        setItem(item)
      }
    })
    // chest has no content, fetch the tools them from the server
  }, [id, isSocketReady, itemCount, setItem, socket])

  return (
    <div x-id={id} className={classNames.join(' ')}>
      <Title id={id}>🛠️ Tool Chest ({itemCount})</Title>
      <Semaphore />
      <ZoomCompensated classNames={['mt-6', 'overflow-hidden']}>
        <ZoomResponsiveWrapper>
          <ChestBody />
        </ZoomResponsiveWrapper>
      </ZoomCompensated>{' '}
      <SignalHandles />
    </div>
  )
}

export default ToolChestNode
