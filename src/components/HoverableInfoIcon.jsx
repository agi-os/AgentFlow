/**
 * Renders a hoverable info icon with a tooltip containing the provided text.
 * @param {string} text - The text to be displayed in the tooltip.
 * @returns {JSX.Element} The rendered hoverable info icon with tooltip.
 */
const HoverableInfoIcon = ({ text }) => {
  return (
    <div className="group relative inline-block">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-4 h-4 text-zinc-400">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
        />
      </svg>
      <div className="opacity-0 border border-zinc-600 text-balance transition-all w-96 shadow-md shadow-zinc-700 bg-zinc-800 text-zinc-100 text-sm rounded-lg py-2 px-4 absolute z-10 group-hover:opacity-100 bottom-full mb-2 -left-full pointer-events-none">
        {text}
        <svg
          className="absolute text-zinc-800 h-2 w-full left-0 top-full"
          x="0px"
          y="0px"
          viewBox="0 0 255 255"
          xmlSpace="preserve">
          <polygon className="fill-current" points="0,0 127.5,127.5 255,0" />
        </svg>
      </div>
    </div>
  )
}

export default HoverableInfoIcon
