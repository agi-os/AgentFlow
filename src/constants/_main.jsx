// This file contains the main system configuration values.
// Start here to calibrate the behavior of the system to your liking.

/**
 * Number of calculations each second (Hz of the AgentFlow CPU).
 * @type {number}
 */
export const TICKS_PER_SECOND = 20

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
export const INITIAL_SPEED = (MAX_SPEED + MIN_SPEED) / 4

/**
 * Minimum dash delay speed of the belt system animation.
 * @type {number}
 */
export const MIN_DASH_DELAY = 8000

/**
 * Maximum dash delay speed of the belt system animation.
 * @type {number}
 */
export const MAX_DASH_DELAY = 150
