/**
 * Debounces a function, ensuring it is only called after a specified delay
 * since the last time it was invoked.
 *
 * @param {Function} func - The function to be debounced.
 * @param {number} [wait=10] - The delay in milliseconds.
 * @returns {Function} - The debounced function.
 */
const debounce = (func, wait = 10) => {
  let timeout
  return (...args) => {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export default debounce
