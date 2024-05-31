import { jest, describe, beforeEach, it, expect } from '@jest/globals'
import { JSDOM } from 'jsdom'
import generateId from './generateId'

describe('generateId', () => {
  beforeEach(() => {
    const dom = new JSDOM('<!doctype html><html><body></body></html>')
    globalThis.window = dom.window
    globalThis.document = dom.window.document
  })

  it('should generate a unique ID', () => {
    // Mock the window.crypto.getRandomValues function
    const mockGetRandomValues = jest.fn().mockImplementation(array => {
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 256)
      }
    })

    // Replace the original function with the mock
    const originalGetRandomValues = window.crypto.getRandomValues
    window.crypto.getRandomValues = mockGetRandomValues

    // Call the function
    const id = generateId(9)

    // Assert the result
    expect(id).toMatch(/^[a-z0-9]{3}-[a-z0-9]{3}-[a-z0-9]{3}$/)

    // Restore the original function
    window.crypto.getRandomValues = originalGetRandomValues
  })
})
