import { useState, useEffect } from 'react'
import { useStore, useStoreApi } from '@xyflow/react'
import io from 'socket.io-client'

/**
 * Custom hook to manage Socket.IO client connection in the application.
 *
 * This hook initializes a Socket.IO client connection to a specified server
 * and stores the connection in the global store for easy access throughout
 * the application. It also provides a cleanup function to disconnect the
 * socket when it is no longer needed.
 *
 * @returns {void}
 */

let socketDone = false

const useSocketFeature = () => {
  const { setState } = useStoreApi()
  const _socket = useStore(s => s.socket)

  const [socket, setSocket] = useState(false)

  // Get the connection manager
  useEffect(() => {
    // If socket exists we're done
    if (socket) return

    // If this already ran once, we're done
    if (socketDone) return

    // Set external flag to prevent React double connecting to the server
    socketDone = true

    // Connect to server
    const newSocket = io('http://localhost:3000')
    setSocket(newSocket)
  }, [socket])

  // Add connection to the store
  useEffect(() => {
    // If we don't yet have a socket abort
    if (!socket) return

    // If socket is already set in store abort
    if (_socket) return

    // Set socket in store
    setState(draft => ({
      ...draft,
      socket,
    }))
  }, [socket, _socket, setState])

  // Start connecting
  useEffect(() => {
    if (!socket || !_socket) return

    // Retry until connected
    let timerId = setInterval(() => _socket.connect(), 100)

    // Clear loop when done
    socket.on('connect', () => clearInterval(timerId))

    // If disconnected try reconnecting
    socket.on('disconnect', () => {
      console.warn('Socket disconnected. Attempting to reconnect...')
      if (timerId === null) {
        timerId = setTimeout(() => {
          console.warn('Reconnection attempt timed out. Retrying...')
          socket.connect()
          timerId = null
        }, 2000)
      }
    })

    // Debugging tools
    /*
    socket.io.on('error', (...e) => console.log('socket.io error', e))
    socket.io.on('ping', (...e) => console.log('socket.io ping', e))
    socket.io.on('reconnect', (...e) => console.log('socket.io reconnect', e))

    socket.on('connect', () => {
      const engine = socket.io.engine
      console.log(engine.transport.name) // in most cases, prints "polling"

      engine.once('upgrade', () => {
        // called when the transport is upgraded (i.e. from HTTP long-polling to WebSocket)
        console.log(engine.transport.name) // in most cases, prints "websocket"
      })

      engine.on('packet', (...e) => console.log('socket.io packet', e))
      engine.on('packetCreate', (...e) =>
        console.log('socket.io packetCreate', e)
      )
      engine.on('drain', (...e) => console.log('socket.io drain', e))
      engine.on('close', (...e) => console.log('socket.io close', e))
    })

    socket.on('data', console.log)
    socket.on('connect_error', console.log)
    socket.on('disconnect', console.log)
    */

    // Cleanup function
    return () => {
      _socket.close()
      console.log('Disconnecting socket for cleanup')
    }
  }, [_socket, socket])
}

export default useSocketFeature
