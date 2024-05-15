/**
 * Portal node is a pair of nodes that are connected by a portal, instantly transporting items between them.
 * Any item ingested by the Input Portal will disappear and reappear at the Output Portal.
 *
 */

import Title from '../components/Title'
import SignalHandles from '../signals/handle'
import { BeltSource, BeltTarget } from '../components/BeltPort'
import Semaphore from '../components/Semaphore'

export const InputPortal = ({ id, selected }) => {
  // Prepare the class names based on the selected state
  const selectedClassNames = selected
    ? ['outline-orange-700']
    : ['outline-transparent']

  const classNames = [...baseClassNames, ...selectedClassNames]

  // Render the portal
  return (
    <div className={classNames.join(' ')}>
      <BeltTarget />
      <Title id={id}>🔗 Portal</Title>
      <div className="flex justify-center">⤴️ abc-def</div>
      <Semaphore />
      <SignalHandles />
    </div>
  )
}

export const OutputPortal = ({ id, selected }) => {
  // Prepare the class names based on the selected state
  const selectedClassNames = selected
    ? ['outline-orange-700']
    : ['outline-transparent']

  const classNames = [...baseClassNames, ...selectedClassNames]

  return (
    <div className={classNames.join(' ')}>
      <Title id={id}>🔗 Portal</Title>
      <div className="flex justify-center">⤵️ abc-def</div>
      <SignalHandles />
      <Semaphore />
      <BeltSource />
    </div>
  )
}

const baseClassNames = [
  'p-1',
  'rounded',
  'text-zinc-300',
  'font-thin',
  'w-28',
  'h-16',
  'border-[1px]',
  'overflow-hidden',
  'transition-all',
  'bg-zinc-800',
  'border-zinc-700',
  'outline-1',
  'outline',
  'outline-offset-8',
]
