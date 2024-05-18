import { useState, useEffect } from 'react'

/**
 * Creates a realistic jittery clock that counts down in a loop imprecisely.
 * @param {Object} options - The options for the jittery clock.
 * @param {number} options.timer - Total duration of the countdown timer in milliseconds.
 * @param {number} options.delay - Delay between each tick of the countdown timer in milliseconds.
 * @param {number} options.jitterPercentage - Max % amount of jitter to add to each tick of the countdown timer.
 * @param {number} options.jitterUpdateInterval - Interval at which to update the jitter value in milliseconds.
 * @returns {Object} The current count and the current jitter value.
 */
const useJitteryCountdown = ({
  timer = 10000,
  delay = 100,
  jitterPercentage = 15,
  jitterUpdateInterval = 4_000,
} = {}) => {
  // Initialize the countdown timer to 0 as it is used as reset downstream
  const [count, setCount] = useState(0)

  // Prepare the "to" value for the Flip component
  const [to, setTo] = useState(new Date().getTime())

  // Update the "to" value only when count is reset
  useEffect(() => {
    if (count === timer) setTo(new Date().getTime() + count)
  }, [count, timer])

  // Initialize the current jitter value internal to this system
  const [currentJitter, setCurrentJitter] = useState(0)

  // Update the countdown timer every delay milliseconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prevCount => {
        if (prevCount > 0) {
          // Decrease the count by delay with internal system jitter added for realism
          return prevCount - delay + currentJitter
        } else {
          // Reset the count to the timer value when it reaches zero
          return timer
        }
      })
    }, delay) // Update every delay milliseconds

    return () => clearInterval(interval) // Cleanup on unmount
  }, [delay, timer, currentJitter])

  // Update jitter amount to emulate real-world external factors changing as time goes on
  useEffect(() => {
    const interval = setInterval(() => {
      // Calculate the max jitter value based on the jitter percentage
      const maxJitter = (delay * jitterPercentage) / 100

      // Calculate a new jitter value
      const newJitter = Math.random() * maxJitter - maxJitter / 2

      // Set the current jitter value with trimmed decimal places
      setCurrentJitter(newJitter | 0)
    }, jitterUpdateInterval) // Update every jitterUpdateInterval milliseconds
    return () => clearInterval(interval) // Cleanup on unmount
  }, [jitterPercentage, jitterUpdateInterval, delay])

  // Return the current count and the current jitter value
  return { count, jitter: currentJitter, to }
}

export default useJitteryCountdown
