import { useEffect, useState } from 'react'
import { useReactFlow, useStore } from '@xyflow/react'
import classNames from '../constants/classNames'
import Title from '../components/Title'
import { BeltSource, BeltTarget } from '../components/BeltPort'
import Semaphore from '../components/Semaphore'
import { validateDataPacket } from '../utils/validation'

const DATABASE_NAME = 'AgentFlowDB'
const DATA_STORE_NAME = 'dataItems'

// Function to initialize the IndexedDB database
const initDatabase = () => {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DATABASE_NAME, 2)

    request.onerror = event => {
      console.error('Error opening IndexedDB:', event.target.error)
      reject(event.target.error)
    }

    request.onsuccess = event => {
      resolve(event.target.result)
    }

    request.onupgradeneeded = event => {
      const db = event.target.result
      if (!db.objectStoreNames.contains(DATA_STORE_NAME)) {
        db.createObjectStore(DATA_STORE_NAME, { autoIncrement: true })
      }
    }
  })
}

const DatabaseNode = ({ id, data }) => {
  const { updateNodeData } = useReactFlow()
  const store = useStore()

  const [dbInstance, setDbInstance] = useState(null)
  const [queryResults, setQueryResults] = useState([])
  const [query, setQuery] = useState('')

  useEffect(() => {
    initDatabase().then(db => setDbInstance(db))
  }, [])

  // Function to export data as a JSON file
  const exportData = () => {
    if (!dbInstance) {
      console.error('Database is not initialized!')
      return
    }

    const transaction = dbInstance.transaction([DATA_STORE_NAME], 'readonly')
    const objectStore = transaction.objectStore(DATA_STORE_NAME)
    const request = objectStore.getAll()

    request.onsuccess = event => {
      const data = event.target.result
      const jsonData = JSON.stringify(data)
      const blob = new Blob([jsonData], { type: 'application/json' })
      const url = URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = url
      link.setAttribute(
        'download',
        `AgentFlow-backup-${new Date().toISOString()}.json`
      )
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }

    request.onerror = event => {
      console.error('Error exporting data:', event.target.error)
    }
  }

  // Function to handle incoming data packets
  const handleDataPacket = packet => {
    if (!dbInstance) return

    try {
      const deserializedPacket = JSON.parse(packet)
      if (!validateDataPacket(deserializedPacket)) {
        console.error('Invalid data packet:', deserializedPacket)
        return
      }

      const transaction = dbInstance.transaction([DATA_STORE_NAME], 'readwrite')
      const objectStore = transaction.objectStore(DATA_STORE_NAME)
      const request = objectStore.add(deserializedPacket)

      request.onsuccess = event => {
        // Optionally log successful data storage
        console.log('Data packet stored in IndexedDB:', event.target.result)
      }

      request.onerror = event => {
        console.error('Error storing data packet:', event.target.error)
      }
    } catch (error) {
      console.error('Error storing data packet:', error)
    }
  }

  // Placeholder for querying functionality (not fully implemented in this example)
  const handleQuery = () => {
    // ... (Implement querying logic using IndexedDB cursors or other methods)
    // Example:
    // const transaction = dbInstance.transaction([DATA_STORE_NAME], 'readonly');
    // const objectStore = transaction.objectStore(DATA_STORE_NAME);
    // // ... (Use a cursor to iterate and filter data based on 'query')
    // // ... (Update 'queryResults' state)
  }

  // Simple UI for querying (placeholder, you'll need to implement a better query mechanism)
  const handleQueryChange = e => setQuery(e.target.value)

  return (
    <div className={classNames.join(' ')}>
      <BeltTarget onReceive={handleDataPacket} />
      <Title id={id}>🗄️ Database</Title>
      <Semaphore />

      {/* Placeholder UI for querying (needs to be implemented properly) */}
      <input
        type="text"
        value={query}
        onChange={handleQueryChange}
        placeholder="Enter query (not implemented)"
        className="w-full p-2 border border-zinc-700 rounded-full bg-zinc-900 text-white"
      />
      <button
        onClick={handleQuery}
        className="px-4 py-2 bg-blue-700 text-white rounded-full mt-2"
        disabled // Disable button as querying is not implemented
      >
        Run Query
      </button>

      {/* Display query results (placeholder) */}
      <pre className="mt-4 text-xs text-white">
        {JSON.stringify(queryResults, null, 2)}
      </pre>

      {/* Button to export data */}
      <button
        onClick={exportData}
        className="px-4 py-2 bg-green-700 text-white rounded-full mt-2">
        Export Data
      </button>

      <BeltSource />
    </div>
  )
}

export default DatabaseNode
