// @vitest-environment jsdom

import { expect, it, vi, describe, beforeEach, afterEach } from 'vitest'

import generateId from './generateId'

// Mock the window.crypto.getRandomValues function
const mockGetRandomValues = vi.fn().mockImplementation(array => {
  for (let i = 0; i < array.length; i++) {
    array[i] = Math.floor(Math.random() * 256)
  }
})

describe('generateId', () => {
  beforeEach(() => {
    // Replace the original function with the mock before each test
    const originalGetRandomValues = window.crypto.getRandomValues
    window.crypto.getRandomValues = mockGetRandomValues

    // Restore the original function after each test
    afterEach(() => {
      window.crypto.getRandomValues = originalGetRandomValues
    })
  })

  it('should generate a unique ID', () => {
    // Call the function
    const id = generateId(9)

    // Assert the result
    expect(id).toMatch(/^[a-z0-9]{3}-[a-z0-9]{3}-[a-z0-9]{3}$/)
  })

  it('should generate an ID with the correct length', () => {
    // Call the function with different lengths
    const id1 = generateId(5)
    const id2 = generateId(10)
    const id3 = generateId(15)

    // Assert the results including the dashes
    expect(id1).toHaveLength(6)
    expect(id2).toHaveLength(13)
    expect(id3).toHaveLength(19)
  })

  it('should generate different IDs on each call', () => {
    // Call the function multiple times
    const id1 = generateId(9)
    const id2 = generateId(9)
    const id3 = generateId(9)

    // Assert the results
    expect(id1).not.toEqual(id2)
    expect(id2).not.toEqual(id3)
    expect(id1).not.toEqual(id3)
  })
})
