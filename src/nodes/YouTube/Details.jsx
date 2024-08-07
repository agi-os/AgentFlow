import { useNodeId } from '@xyflow/react'
import YouTube from 'react-youtube'
import React, { useCallback, useState, useRef } from 'react'

import { useStore } from '@xyflow/react'
import { inputClassNames } from '../Entry/constants'
import { getVideoIdFromUrl } from './getVideoIdFromUrl'
import { formatSeconds } from './formatSeconds'
import {
  ragTitlesClassNames,
  ragTitlesSubgridClassNames,
  youtubeOptions,
  buttonClassNames,
} from './constants'
import { fetchLLMSegmentation } from './fetchLLMSegmentation'
import { fetchRagTitles } from './fetchRagTitles'

const Spinner = () => <div>loading ragtitles...</div>

const generate30SecondPacks = ragTitles => {
  let buckets = {}
  const bucketSize = 30

  for (let i = 0; i < ragTitles.length; i++) {
    const { time, text } = ragTitles[i]
    const offset = Math.floor(time / bucketSize)
    if (!buckets[offset]) {
      buckets[offset] = []
    }
    buckets[offset].push(text)
  }

  return Object.entries(buckets).map(([time, text]) => ({
    time: parseInt(time, 10) * bucketSize,
    text: text.join(' '),
  }))
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

  const [hideOutput, setHideOutput] = useState(false)
  const [hideOutput2, setHideOutput2] = useState(false)

  const [height1, setHeight1] = useState(10)

  const onPlayerReady = player => {
    youTubePlayerRef.current = player.target
    window.yt = player.target
  }

  const handleSeekTo = useCallback(
    time => youTubePlayerRef.current.seekTo(Number(time)),
    [youTubePlayerRef]
  )

  const handleNewUrlInput = useCallback(() => {
    const newUrl = prompt('Enter new URL')
    const newVideoId = getVideoIdFromUrl(newUrl)
    if (newVideoId) {
      setVideoId(newVideoId)
      setRagTitles([])
      setOutput([])
      setOutput2([])
    }
  }, [])

  const handleRagTitlesClick = () => {
    fetchRagTitles({
      store,
      videoId,
      setRagTitles,
      setSpinner,
      generate30SecondPacks,
    })

    setCollapse1(false)
  }

  const handleLLMSegmentationClick = () => {
    fetchLLMSegmentation(store, ragTitles, setOutput2)
  }

  const handle30SecondPacksClick = () => {
    setOutput(generate30SecondPacks(ragTitles))
  }

  const RenderRagTitles = () => (
    <div
      className={ragTitlesClassNames.join(' ')}
      style={{
        maxHeight: `${height1}rem`,
      }}>
      {ragTitles.map(({ time, text }) => (
        <div key={time + text} className={ragTitlesSubgridClassNames.join(' ')}>
          <div>{formatSeconds(time)}</div>
          {text && (
            <div
              onClick={() => handleSeekTo(time)}
              className="cursor-pointer text-ellipsis overflow-hidden whitespace-nowrap">
              {text}
            </div>
          )}
        </div>
      ))}
    </div>
  )

  const RenderLLMSegmentation = () => (
    <div
      className={ragTitlesClassNames.join(' ')}
      style={{
        maxHeight: `${height1}rem`,
      }}>
      {output2.map(({ time, topic }) => (
        <div
          key={time + topic}
          className={ragTitlesSubgridClassNames.join(' ')}>
          <div className="text-[0.5rem] font-mono">{formatSeconds(time)}</div>
          <div
            className="font-extralight -mt-1 hover:underline hover:cursor-pointer p-2 rounded-lg hover:bg-zinc-700 leading-none"
            onClick={() => youTubePlayerRef.current.seekTo(time)}>
            {topic}
          </div>
        </div>
      ))}
    </div>
  )

  const Render30SecondPacks = () => (
    <div
      className={ragTitlesClassNames.join(' ')}
      style={{
        maxHeight: `${height1}rem`,
      }}>
      {output.map(({ time, text }) => (
        <div key={time} className={ragTitlesSubgridClassNames.join(' ')}>
          <div className="text-[0.5rem] font-mono">{formatSeconds(time)}</div>
          {text && (
            <div
              onClick={() => handleSeekTo(time)}
              className="text-[0.4rem] leading-[0.55rem] font-extralight cursor-pointer">
              {text}
            </div>
          )}
        </div>
      ))}
    </div>
  )

  return (
    <div x-node-id={nodeId}>
      <input
        className={inputClassNames.join(' ')}
        value={videoId}
        onClick={handleNewUrlInput}
        readOnly
      />
      <YouTube
        videoId={videoId}
        opts={youtubeOptions}
        onReady={onPlayerReady}
        className="w-full overflow-hidden mt-2"
      />

      {spinner ? (
        <Spinner />
      ) : (
        <>
          {!ragTitles?.length && (
            <button
              className={buttonClassNames.join(' ')}
              onClick={handleRagTitlesClick}>
              ⤵️ get timestamped subtitles
            </button>
          )}
          {ragTitles?.length && (
            <button
              className={buttonClassNames.join(' ')}
              onClick={() => {
                setCollapse1(false)
                setHeight1(height1 * 0.75)
              }}>
              🔍 🔻
            </button>
          )}
          {ragTitles?.length && (
            <button
              className={buttonClassNames.join(' ')}
              onClick={() => {
                setCollapse1(false)
                setHeight1(height1 * 1.25)
              }}>
              🔍 ↕️
            </button>
          )}

          {ragTitles?.length && (
            <button
              className={[buttonClassNames].flat().join(' ')}
              onClick={() => setCollapse1(!collapse1)}>
              Baseline subtitles {!collapse1 ? '📂' : '📁'}
            </button>
          )}

          {collapse1 || <RenderRagTitles />}

          {!output2?.length && (
            <button
              className={buttonClassNames.join(' ')}
              onClick={handleLLMSegmentationClick}>
              prepare LLM based topic segmentation timestamps
            </button>
          )}

          {ragTitles?.length && (
            <button
              className={[buttonClassNames].flat().join(' ')}
              onClick={() => setHideOutput2(!hideOutput2)}>
              LLM segmentation {!hideOutput2 ? '📂' : '📁'}
            </button>
          )}

          {!hideOutput2 && <RenderLLMSegmentation />}

          {!output?.length && (
            <button
              className={buttonClassNames.join(' ')}
              onClick={handle30SecondPacksClick}>
              prepare 30 second text packs for LLM use
            </button>
          )}

          {output?.length && (
            <button
              className={[buttonClassNames].flat().join(' ')}
              onClick={() => setHideOutput(!hideOutput)}>
              30 second segments {!hideOutput ? '📂' : '📁'}
            </button>
          )}
          {!hideOutput && <Render30SecondPacks />}
        </>
      )}
    </div>
  )
}

export default Details
