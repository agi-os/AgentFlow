const initialEdges = [
  // {
  //   id: 'edge1',
  //   source: 'box1',
  //   sourceHandle: 'green',
  //   target: 'box2',
  //   targetHandle: 'green',
  // },
  // {
  //   id: 'edge2',
  //   source: 'box1',
  //   sourceHandle: 'blue',
  //   target: 'box2',
  //   targetHandle: 'blue',
  // },
  {
    id: 'chest1->chest2',
    source: 'chest-1',
    sourceHandle: 'outbox',
    target: 'chest-2',
    targetHandle: 'inbox',
    animated: true,
    style: { strokeWidth: '3rem', strokeOpacity: 0.1 },
  },
  {
    id: 'cc1->chest1',
    source: 'cc1',
    sourceHandle: 'orange',
    target: 'chest-1',
    targetHandle: 'orange',
    style: { stroke: 'orange' },
  },
  {
    id: 'cc1->chest2',
    source: 'cc1',
    sourceHandle: 'orange',
    target: 'chest-2',
    targetHandle: 'orange',
    style: { stroke: 'orange' },
  },
]

export default initialEdges
