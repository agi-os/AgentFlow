import { ITEM_STORE, NODE_STORE, EDGE_STORE } from '../../../constants/database'

export const OBJECT_STORES = {
  ITEMS: ITEM_STORE,
  NODES: NODE_STORE,
  EDGES: EDGE_STORE,
}

const filterEdge = edge =>
  JSON.parse(
    JSON.stringify(edge, (key, value) =>
      ['length', 'selected'].includes(key) ? undefined : value
    )
  )

const filterNode = node =>
  JSON.parse(
    JSON.stringify(node, (key, value) =>
      ['location', 'selected', 'dragging', 'measured'].includes(key)
        ? undefined
        : key === 'position'
        ? { x: Math.floor(value.x), y: Math.floor(value.y) }
        : value
    )
  )

// --- End Data Filtering Functions ---
// Data Type Configuration (Includes Filtering)

const dataTypesConfig = {
  items: {
    store: OBJECT_STORES.ITEMS,
    selector: state => state.items,
  },
  nodes: {
    store: OBJECT_STORES.NODES,
    selector: state => state.nodes,
    filter: filterNode,
  },
  edges: {
    store: OBJECT_STORES.EDGES,
    selector: state => state.edges,
    filter: filterEdge,
  },
}

export default dataTypesConfig
