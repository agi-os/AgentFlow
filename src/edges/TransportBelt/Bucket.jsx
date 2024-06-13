import useTransportBeltStore from '../../hooks/useTransportBeltStore'

const Bucket = ({ id, index }) => {
  const { bucketContents } = useTransportBeltStore(id)

  return (
    <div className={className.join(' ')}>
      {index}
      {JSON.stringify(bucketContents[index])}
    </div>
  )
}

const className = [
  'border',
  'opacity-50',
  'grid',
  'place-content-center',
  'rounded-full',
  'h-10',
  'w-10',
  'border-zinc-600',
  '-translate-x-1/2',
  '-translate-y-1/2',
  'text-zinc-500',
]

export default Bucket
