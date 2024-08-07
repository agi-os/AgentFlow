import { decompressData } from './decompressData'
import { compressData } from './compressData'
import { jsonrepair } from 'jsonrepair'

export const copyToClipboard = async data => {
  try {
    // Clone the data to not modify the source
    const { nodes, edges } = JSON.parse(JSON.stringify(data))

    // If there are no nodes, abort
    if (!nodes || nodes.length === 0) return

    // Compress the data
    const compressedData = compressData({ nodes, edges })

    await navigator.clipboard.writeText(JSON.stringify(compressedData))
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

export const handleCopyPasteKeypress = ({ event, onCopy, onPaste }) => {
  const { ctrlKey, key } = event
  if (ctrlKey && key === 'c') {
    onCopy()
  } else if (ctrlKey && key === 'v') {
    onPaste(event)
  }
}

export const readClipboardData = async () => {
  let clipboardData = await navigator.clipboard.readText()

  // If we're pasting a youtube video, use it as a node
  if (
    clipboardData?.startsWith('https://www.youtube.com/watch?v=') ||
    clipboardData?.startsWith('https://youtu.be/')
  ) {
    // Generate a random ID for the new node
    const randomId = Array.from({ length: 3 }, () =>
      String.fromCharCode(Math.floor(Math.random() * 52) + 65)
    ).join('')

    // Replace the pasted data with a YouTube node
    const newObject = {
      n: {
        [randomId]: [
          [],
          Math.floor(Math.random() * 100),
          Math.floor(Math.random() * 100),
          'youTube',
        ],
      },
      e: [],
    }

    console.log('using random', newObject)

    clipboardData = JSON.stringify(newObject)
  }

  return JSON.parse(jsonrepair(clipboardData))
}

export const fetchDataFromClipboard = async () => {
  const parsed = await readClipboardData()
  return decompressData(parsed)
}
