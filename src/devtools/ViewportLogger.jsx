import { Panel, useStore } from '@xyflow/react'

const ViewportLogger = () => {
  const viewport = useStore(
    s =>
      `x: ${s.transform[0].toFixed(2)}, y: ${s.transform[1].toFixed(
        2
      )}, zoom: ${s.transform[2].toFixed(2)}`
  )

  return (
    <Panel position="top-right">
      <div
        className="bg-zinc-700 text-white px-3 py-1 mt-12 rounded-md
      ">
        {viewport}
      </div>
    </Panel>
  )
}

export default ViewportLogger
