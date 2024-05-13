import DefaultView from './DefaultView'
import DetailedView from './Detailed/index'
import SummaryView from './Summary/index'
import { useStore } from '@xyflow/react'

/**
 * Renders the appropriate view for the Chest component based on the zoom level.
 *
 * @param {Object} props - The component props.
 * @returns {JSX.Element} The rendered view component.
 */
export const ChestView = props => {
  // Extract the zoom level from the store
  const zoom = useStore(s => s.transform[2].toFixed(2))

  // Render SummaryView if zoom level is below 1
  if (zoom <= 1) return <SummaryView {...props} />

  // Render DefaultView if zoom level is between 1 and 2
  if (zoom <= 2) return <DefaultView {...props} />

  // Render DetailedView for all other zoom levels
  return <DetailedView {...props} />
}
