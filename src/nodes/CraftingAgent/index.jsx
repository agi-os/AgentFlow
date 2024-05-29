import Header from './Header'
import Details from './Details'
import { Belts } from '../../components/BeltPort'
import SignalHandles from '../../signals/SignalHandles'
import { nodeClassNames } from './constants'

/**
 * Prepare and render the necessary components with specific class names based on the selected state.
 *
 * @returns {JSX.Element} The rendered JSX elements with the calculated class names.
 */
const CraftingAgentNode = ({ id, selected }) => {
  // Prepare the class names based on the selected state
  const selectedClassNames = selected
    ? ['outline-offset-8', 'outline-2']
    : ['outline-offset-0', 'outline-0']

  const classNames = [...nodeClassNames, ...selectedClassNames, 'max-w-xl']

  return (
    <div x-node-id={id} className={classNames.join(' ')}>
      <Header />
      <Details />
      <Belts />
      <SignalHandles />
    </div>
  )
}

export default CraftingAgentNode
