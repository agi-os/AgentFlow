import getItemStore from '../stores/item'
import { useEffect, useState } from 'react'

/**
 * A custom hook that provides access to the item state.
 *
 * @param {string} props - The props defining the item store bucket.
 * @returns {Object} - The current state of the item.
 */
const useItemState = props => {
  // Get the store for the given props
  const itemStore = getItemStore(props)

  // Initialize a state variable state with the initial value from the itemStore
  const [reactState, setReactState] = useState(itemStore.getState())

  // Use the useEffect hook to subscribe to changes in the itemStore
  useEffect(() => {
    // Subscribe to the itemStore
    itemStore.subscribe(storeState => {
      // Update the state state variable whenever the state changes
      setReactState(storeState)
    })
  }, [itemStore])

  // Return the state
  return reactState
}

export default useItemState
