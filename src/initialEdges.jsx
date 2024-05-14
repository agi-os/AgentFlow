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
    type: 'animated',
  },
  {
    id: 'sp1->chest2',
    source: 'sp1',
    sourceHandle: 'outbox2',
    target: 'chest-2',
    targetHandle: 'inbox',
    animated: true,
    type: 'animated',
  },
  // {
  //   id: 'chest1->cc1',
  //   source: 'chest-1',
  //   sourceHandle: 'lte',
  //   target: 'cc1',
  //   targetHandle: 'rte',
  //   type: 'belt',
  //   animated: true,
  // },
]

export default initialEdges
