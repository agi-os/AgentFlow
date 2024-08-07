import Title from '../../components/Title'
import { useState } from 'react'

const Header = () => {
  const [enhance, setEnhance] = useState(false)

  return (
    <div style={{ position: 'relative' }}>
      <Title>
        <span className="hue-rotate-[135deg]">🎦</span>
        YouTube
        <button
          className="pl-5 opacity-20 hover:opacity-100 text-xs hover:underline"
          onClick={() => setEnhance(!enhance)}>
          (click here to level up)
        </button>
        {enhance && (
          <div className="text-lg px-3 py-8">
            You can enhance your YouTube video player experience by installing
            <a
              className="underline font-medium pl-2"
              target="_blank"
              href="https://improvedtube.com/">
              ImprovedTube
            </a>
            <a
              className="underline font-medium pl-2"
              target="_blank"
              href="https://chrome.google.com/webstore/detail/improve-youtube-video-you/bnomihfieiccainjcjblhegjgglakjdd">
              extension
            </a>
            , to automatically skip all useless spam and hide "suggestion"
            overlays no one asked for and we can not disable.
            <br />
            <br />
            Our subtitle library (
            <a
              className="underline px-0.5"
              target="_blank"
              href="https://www.npmjs.com/package/ragtitles">
              ragtitles
            </a>
            ) automatically removes all spam before returning the subtitles, but
            you will need to clean up the video player yourself by installing
            the extension above. This will allow you to watch uninterrupted.
            <br />
            <br />
            Or enjoy watching spam and wasting your life, it's up to you
            ¯\_(ツ)_/¯
          </div>
        )}
      </Title>
    </div>
  )
}

export default Header
