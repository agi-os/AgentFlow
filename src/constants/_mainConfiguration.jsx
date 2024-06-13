// This file contains the main system configuration values.
// Start here to calibrate the behavior of the system to your liking.

/**
 * Number of calculations each second (Hz of the AgentFlow CPU).
 * @type {number}
 */
export const TICKS_PER_SECOND = 60
/**
 * Minimum speed of the belt system.
 * @type {number}
 */
export const MIN_SPEED = 5

/**
 * Maximum speed of the belt system.
 * @type {number}
 */
export const MAX_SPEED = MIN_SPEED * 60

/**
 * Initial speed of the belt system.
 * @type {number}
 */
export const INITIAL_SPEED = (MAX_SPEED + MIN_SPEED) / 5

/**
 * Minimum dash delay speed of the belt system animation.
 * @type {number}
 */
export const MIN_DASH_DELAY = 5000

/**
 * Maximum dash delay speed of the belt system animation.
 * @type {number}
 */
export const MAX_DASH_DELAY = 90

/**
 * Countdown delay in seconds for the default blue semaphore state.
 * @type {number}
 */
export const BLUE_COUNTDOWN = 4

/**
 * Countdown delay in seconds for the green semaphore state.
 * @type {number}
 */
export const GREEN_COUNTDOWN = 2

/**
 * Countdown delay in seconds for the yellow semaphore state.
 * @type {number}
 */
export const YELLOW_COUNTDOWN = 7
