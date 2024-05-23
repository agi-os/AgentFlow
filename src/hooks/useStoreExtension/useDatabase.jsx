import { DATABASE_NAME, EDGE_STORE, NODE_STORE } from '../../constants/database'

/**
 * Initializes the IndexedDB by opening a connection with the specified database name and version.
 * Handles errors during the database opening process and database upgrades.
 * If the database version increases, it creates the necessary object stores for 'nodes' and 'edges'.
 *
 * @returns {Promise<IDBDatabase>} A promise that resolves with the database instance once it is successfully opened.
 */
const initIndexedDB = () => {
  return new Promise((resolve, reject) => {
    // Set the version of the database, increment this for schema changes
    const version = 2
    // Open a connection to the IndexedDB with the specified database name and version
    const request = window.indexedDB.open(DATABASE_NAME, version)

    // Handle errors during the opening of the database
    request.onerror = event => {
      console.error('Error creating or upgrading database:', event.target.error)
      // Reject the promise if an error occurs
      reject(event.target.error)
    }

    // Handle successful database opening
    request.onsuccess = event => {
      const db = event.target.result
      // Resolve the promise with the database instance
      resolve(db)
    }

    // Handle database upgrades, necessary when the version number increases
    request.onupgradeneeded = event => {
      const db = event.target.result

      // Create the 'nodes' object store if it doesn't exist
      if (!db.objectStoreNames.contains(NODE_STORE)) {
        db.createObjectStore(NODE_STORE, { keyPath: 'id' })
      }

      // Create the 'edges' object store if it doesn't exist
      if (!db.objectStoreNames.contains(EDGE_STORE)) {
        db.createObjectStore(EDGE_STORE, { keyPath: 'id' })
      }

      // Close the database once the transaction for upgrade completes
      event.target.transaction.oncomplete = () => {
        db.close()
      }
    }
  })
}

/**
 * Asynchronously loads data from IndexedDB and updates the state of the provided store with the retrieved nodes and edges.
 *
 * @param {Object} store - The store object to update with the retrieved data.
 * @returns {Promise} A promise that resolves once the data loading and state update is completed, or rejects if an error occurs.
 */
export const loadFromIndexedDB = async store => {
  // Initialize the IndexedDB and get a database instance
  try {
    const db = await initIndexedDB()

    // Start a transaction on the NODE_STORE and EDGE_STORE in readonly mode
    const transaction = db.transaction([NODE_STORE, EDGE_STORE], 'readonly')

    // Access the NODE_STORE from the transaction
    const nodeStore = transaction.objectStore(NODE_STORE)

    // Access the EDGE_STORE from the transaction
    const edgeStore = transaction.objectStore(EDGE_STORE)

    // Retrieve all nodes from the NODE_STORE
    const nodes = await new Promise((resolve, reject) => {
      const request = nodeStore.getAll()
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })

    // Retrieve all edges from the EDGE_STORE
    const edges = await new Promise((resolve, reject) => {
      const request = edgeStore.getAll()
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })

    // Update the state of the store with the retrieved nodes and edges
    store.setState({ nodes, edges })
  } catch (error) {
    // Log any errors that occur during the loading process
    console.error('Error loading data from IndexedDB:', error)
  }
}

/**
 * Save the current state of nodes and edges from the store to IndexedDB.
 *
 * @param {Object} store - The store containing the current state of nodes and edges.
 * @returns {void}
 */
export const saveToIndexedDB = store => {
  // Extract nodes and edges from the store's current state
  const { nodes, edges } = store.getState()

  // Initialize IndexedDB and proceed once it is ready
  initIndexedDB().then(db => {
    // Start a transaction for both NODE_STORE and EDGE_STORE with readwrite access
    const transaction = db.transaction([NODE_STORE, EDGE_STORE], 'readwrite')
    // Access the 'nodes' object store from the transaction
    const nodeStore = transaction.objectStore(NODE_STORE)
    // Access the 'edges' object store from the transaction
    const edgeStore = transaction.objectStore(EDGE_STORE)

    // Clear all existing data in the 'nodes' object store
    nodeStore.clear()
    // Clear all existing data in the 'edges' object store
    edgeStore.clear()

    // Add each node from the store to the 'nodes' object store
    nodes.forEach(node => nodeStore.put(node))
    // Add each edge from the store to the 'edges' object store
    edges.forEach(edge => edgeStore.put(edge))
  })
}
