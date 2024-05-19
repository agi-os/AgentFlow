/* eslint-disable no-unused-vars */
/**
 * Debounces a function, ensuring it is only called after a specified delay
 * since the last time it was invoked.
 *
 * @param {Function|string} funcOrName - The function to be debounced or the name of the function.
 * @param {Function} [func] - The function to be debounced if the first argument is a name.
 * @param {number} [wait=10] - The delay in milliseconds.
 * @returns {Function} - The debounced function.
 */
const debounce = (...args) => {
  let timeout
  let name
  let func
  let wait = 100

  if (typeof args[0] === 'string') {
    name = args[0]
    func = args[1]
    wait = args[2] || wait
  } else {
    func = args[0]
    wait = args[1] || wait
    name = func.name || 'anonymous'
  }

  return (...args) => {
    const later = () => {
      clearTimeout(timeout)
      // console.log('calling debounced function', { name, func, args })
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export default debounce
