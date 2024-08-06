import { useNodeId } from '@xyflow/react'
import YouTube from 'react-youtube'
import React, { useState, useRef, useMemo } from 'react'

import { useStore } from '@xyflow/react'
import { inputClassNames } from '../Entry/constants'

const ragTitlesClassNames = [
  'grid',
  'max-h-[10rem]',
  'overflow-y-auto',
  'text-sm',
  'gap-0',
]

const buttonClassNames = [
  'p-2',
  'm-5',
  'rounded-full',
  'bg-blue-700',
  'text-white',
]

const youtubeOptions = {
  cc_load_policy: true,
  iv_load_policy: 3,
  width: '100%',
}

const Spinner = () => <div>loading ragtitles...</div>

/**
 * Convert seconds to MM:SS
 */
const formatSeconds = seconds => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)

  const formattedMinutes = String(minutes).padStart(2, '0')
  const formattedSeconds = String(remainingSeconds).padStart(2, '0')

  return `${formattedMinutes}:${formattedSeconds}`
}

const Details = () => {
  const store = useStore()
  const nodeId = useNodeId()

  const [videoId, setVideoId] = useState('ZAGiinWiFsE')

  const [spinner, setSpinner] = useState(false)

  const [output, setOutput] = useState([])
  const [output2, setOutput2] = useState([])

  const [ragTitles, setRagTitles] = useState([])

  const youTubePlayerRef = useRef(null)

  const [collapse1, setCollapse1] = useState(false)

  const onPlayerReady = player => {
    youTubePlayerRef.current = player.target
    console.log(player)
  }

  return (
    <div x-node-id={nodeId}>
      <input
        className={inputClassNames.join(' ')}
        value={videoId}
        onClick={() => {
          const newUrl = prompt('Enter new URL')
          if (newUrl) {
            const url = new URL(newUrl)
            const videoId = url.searchParams.get('v')
            setVideoId(videoId)
          }
        }}></input>
      <YouTube
        videoId={videoId}
        opts={youtubeOptions}
        onReady={onPlayerReady}
        className="w-full overflow-hidden mt-2"></YouTube>
      {spinner ? (
        <Spinner />
      ) : (
        <>
          <button
            className={buttonClassNames.join(' ')}
            onClick={() => {
              setSpinner(true)
              store.socket.emit(
                'ragTitles',
                {
                  url: 'https://www.youtube.com/watch?v=' + videoId,
                },
                re => {
                  setSpinner(false)
                  setRagTitles(re)
                  setCollapse1(false)
                }
              )
            }}>
            Get RagTitles for this video
          </button>

          <button
            className={buttonClassNames.join(' ')}
            onClick={() => {
              setCollapse1(!collapse1)
            }}>
            Toggle ragtitles
          </button>
          {collapse1 || (
            <div
              className={ragTitlesClassNames.join(' ')}
              style={{ gridTemplateColumns: '3rem auto' }}>
              {ragTitles.map(({ time, text }) => [
                <div
                  className="hover:bg-slate-900 rounded-full px-3"
                  onMouseEnter={() => youTubePlayerRef.current.seekTo(time)}
                  key={time + 's'}>
                  {time}
                </div>,
                <div key={time + 't'}>{text}</div>,
              ])}
            </div>
          )}
        </>
      )}
      <hr className="m-4" />
      <button
        className={buttonClassNames.join(' ')}
        onClick={() => {
          store.socket.emit(
            'ragTitleSegmentation',
            {
              transcript: ragTitles
                .map(({ time, text }) => `${time} ${text}`)
                .join('\n'),
            },
            re => {
              setOutput2(re)
            }
          )
        }}>
        prepare LLM based topic segmentation timestamps
      </button>
      <div
        className={ragTitlesClassNames.join(' ')}
        style={{ gridTemplateColumns: '3rem auto' }}>
        {output2.map(({ time, topic }) => [
          <div className="font-mono text-xs" key={time + 's'}>
            {formatSeconds(time)}
          </div>,
          <div
            className="font-bold hover:underline hover:cursor-pointer hover:bg-zinc-700"
            key={time + 't'}
            onClick={() => {
              youTubePlayerRef.current.seekTo(time)
            }}>
            {topic}
          </div>,
        ])}
      </div>
      <hr className="m-4" />
      <button
        className={buttonClassNames.join(' ')}
        onClick={() => {
          let buckets = {}
          const bucketSize = 30 // 30 seconds

          // Loop over all titles, appending them to the correct offset bucket of seconds
          for (let i = 0; i < ragTitles.length; i++) {
            const { time, text } = ragTitles[i]
            const offset = Math.floor(time / bucketSize)
            if (!buckets[offset]) {
              buckets[offset] = []
            }
            buckets[offset].push(text)
          }

          const result = Object.entries(buckets).map(([time, text]) => ({
            time: parseInt(time, 10) * bucketSize,
            text: text.join(' '),
          }))

          setOutput(result)
        }}>
        prepare 30 second packs
      </button>
      <div
        className={ragTitlesClassNames.join(' ')}
        style={{ gridTemplateColumns: '3rem auto' }}>
        {output.map(({ time, text }) => [
          <div key={time + 's'}>{formatSeconds(time)}</div>,
          <div
            key={time + 't'}
            onClick={() => {
              youTubePlayerRef.current.seekTo(time)
            }}>
            {text}
          </div>,
        ])}
      </div>
    </div>
  )
}

export default Details
