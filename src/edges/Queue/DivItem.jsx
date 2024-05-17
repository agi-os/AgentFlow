import InViewContent from './InViewContent'

const DivItem = ({ item, divRef }) => {
  return (
    <div
      x-id={item.id}
      ref={divRef}
      xmlns="http://www.w3.org/1999/xhtml"
      className={classNames.join(' ')}>
      <div x-id={item.id} className="relative -top-0.5">
        {item.emoticon}
      </div>
      <InViewContent item={item} />
    </div>
  )
}

const classNames = [
  'grid',
  'place-items-center',
  'w-10',
  'h-10',
  'relative',
  'rounded-full',
  'bg-zinc-900',
  'border',
  'border-zinc-900',
  'bg-opacity-85',
  '-top-5',
  '-left-5',
  'shadow-inner',
  'shadow-zinc-800',
  'select-none',
]

export default DivItem
