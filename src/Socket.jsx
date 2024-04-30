import { createContext, useEffect, useState } from 'react'
import io from 'socket.io-client'

// Create a context for the socket
export const SocketContext = createContext()

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    // Create a new Socket.IO client connection
    const newSocket = io('http://localhost:3000')

    // Set the new socket in the state
    setSocket(newSocket)

    // Log a message when the socket connects
    newSocket.on('connect', () => {
      console.log('Connected to Socket.IO server')
    })

    // Cleanup function to disconnect the socket when the component unmounts
    return () => {
      newSocket.disconnect()
    }
  }, [])

  // Provide the socket to the rest of the app
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  )
}
