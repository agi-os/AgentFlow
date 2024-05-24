import { DATABASE_NAME } from '../../../constants/database'
import { OBJECT_STORES } from './dataTypesConfig'

const openDatabase = () => {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DATABASE_NAME)
    request.onsuccess = event => resolve(event.target.result)
    request.onerror = event => reject(event.target.error)
    request.onupgradeneeded = event => {
      const db = event.target.result
      Object.values(OBJECT_STORES).forEach(storeName => {
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { keyPath: 'id' })
        }
      })
    }
  })
}

export default openDatabase
