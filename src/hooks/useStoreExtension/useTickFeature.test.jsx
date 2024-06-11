// @vitest-environment jsdom

import { expect, it, describe, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { ReactFlowProvider } from '@xyflow/react'
import React from 'react'

import useTickFeature from './useTickFeature'

describe('useTickFeature', () => {
  it('should extend the store', () => {
    const wrapper = ({ children }) => (
      <ReactFlowProvider>{children}</ReactFlowProvider>
    )

    // Render the hook
    const { result } = renderHook(() => useTickFeature(), { wrapper })

    // Check if we get back the store
    expect(result.current.getState).toBeTypeOf('function')
    expect(result.current.setState).toBeTypeOf('function')
    expect(result.current.subscribe).toBeTypeOf('function')

    // Get the latest state
    const state = result.current.getState()

    // Check if state was extended
    expect(state.tickCounter).toBe(0)
    expect(state.tickCallbacks).toBeTypeOf('object')
    expect(state.tick).toBeTypeOf('function')
    expect(state.setTickLength).toBeTypeOf('function')

    // Trigger once
    state.tick()

    // Get latest state
    const { tickCounter } = result.current.getState()

    // Check if count incremented
    expect(tickCounter).toBe(1)
  })

  it('should extend the store with tickCounter, tickCallbacks, tick, and setTickLength functions', () => {
    const wrapper = ({ children }) => (
      <ReactFlowProvider>{children}</ReactFlowProvider>
    )

    // Render the hook
    const { result } = renderHook(() => useTickFeature(), { wrapper })

    // Check if we get back the store
    expect(result.current.getState).toBeTypeOf('function')
    expect(result.current.setState).toBeTypeOf('function')
    expect(result.current.subscribe).toBeTypeOf('function')

    // Get the latest state
    const state = result.current.getState()

    // Check if state was extended
    expect(state.tickCounter).toBe(0)
    expect(state.tickCallbacks).toBeTypeOf('object')
    expect(state.tick).toBeTypeOf('function')
    expect(state.setTickLength).toBeTypeOf('function')
  })

  it('should increment tickCounter when tick function is called', () => {
    const wrapper = ({ children }) => (
      <ReactFlowProvider>{children}</ReactFlowProvider>
    )

    // Render the hook
    const { result } = renderHook(() => useTickFeature(), { wrapper })

    // Get the latest state
    const state = result.current.getState()

    // Trigger tick function multiple times
    state.tick()
    state.tick()
    state.tick()

    // Get latest state
    const { tickCounter } = result.current.getState()

    // Check if count incremented correctly
    expect(tickCounter).toBe(3)
  })

  it('should update tickLength when setTickLength function is called', () => {
    const wrapper = ({ children }) => (
      <ReactFlowProvider>{children}</ReactFlowProvider>
    )

    // Render the hook
    const { result } = renderHook(() => useTickFeature(), { wrapper })

    // Get the latest state
    const state = result.current.getState()

    // Call setTickLength function with a new value
    state.setTickLength(100)

    // Get latest state
    const { tickLength } = result.current.getState()

    // Check if tickLength was updated correctly
    expect(tickLength).toBe(100)
  })

  it('should call tickCallbacks when tick function is called', () => {
    const wrapper = ({ children }) => (
      <ReactFlowProvider>{children}</ReactFlowProvider>
    )

    // Render the hook
    const { result } = renderHook(() => useTickFeature(), { wrapper })

    // Get the latest state
    const state = result.current.getState()

    // Add a callback to tickCallbacks
    const callback = vi.fn()
    state.tickCallbacks.set('testCallback', callback)

    // Call tick function
    state.tick()

    // Check if callback was called
    expect(callback).toHaveBeenCalled()
  })
})
