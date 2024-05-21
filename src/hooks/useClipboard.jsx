import { useCallback, useState } from 'react'

const useClipboard = () => {
  const [clipboardContent, setClipboardContent] = useState('')

  const readFromClipboard = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText()
      setClipboardContent(text)
      return text
    } catch (error) {
      console.error('Failed to read from clipboard:', error)
      return ''
    }
  }, [])

  const writeToClipboard = useCallback(async text => {
    try {
      await navigator.clipboard.writeText(text)
      setClipboardContent(text)
    } catch (error) {
      console.error('Failed to write to clipboard:', error)
    }
  }, [])

  return { clipboardContent, readFromClipboard, writeToClipboard }
}

export default useClipboard
