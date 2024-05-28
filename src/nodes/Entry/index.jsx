import baseClassNames from '../classNames'

import { BeltSource } from '../../components/BeltPort'
import Countdown from '../ItemChest/Countdown'

import Header from './Header'
import Details from './Details'
import OutboxItems from './OutboxItems'

// Use these class arrays in the component
const EntryNode = ({ id, data, selected }) => {
  // Prepare the class names based on the selected state
  const selectedClassNames = selected
    ? ['outline-offset-8', 'outline-2']
    : ['outline-offset-0', 'outline-0']

  const classNames = [...baseClassNames, ...selectedClassNames, 'max-w-xl']

  // Component JSX remains the same, replace className strings with the appropriate variables
  return (
    <div x-node-id={id} className={classNames.join(' ')}>
      <Header />
      <Details />
      <OutboxItems />
      {data?.semaphore !== 'red' && <Countdown />}
      <BeltSource />
    </div>
  )
}

export default EntryNode
