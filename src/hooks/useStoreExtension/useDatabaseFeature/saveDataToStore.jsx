import openDatabase from './openDatabase'

const saveDataToStore = async (storeName, data) => {
  // Sanity check
  if (!data || !data.length) return

  const db = await openDatabase()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite')
    const store = transaction.objectStore(storeName)
    store.clear() // Clear before adding
    data.forEach(item => {
      // Warn if item can not be added
      if (!item.id) {
        console.warn('Cannot save to DB, no ID:', item)
        return
      }
      store.add(item)
    })
    transaction.oncomplete = () => resolve()
    transaction.onerror = () => reject(transaction.error)
  })
}

export default saveDataToStore
