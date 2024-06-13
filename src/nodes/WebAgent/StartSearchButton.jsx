/**
 * Renders a button to trigger a LLM call if enabled, otherwise displays a message.
 * @param {Function} onClick - The function to be called when the button is clicked.
 * @param {boolean} enabled - Flag to determine if the button is enabled or disabled.
 * @returns {JSX.Element} - A button element to trigger LLM call if enabled, or a message if disabled.
 */
const StartSearchButton = ({ batchSize, onClick }) => {
  const handleClick = onClick || (() => {})

  return (
    <button
      className="border border-zinc-600 transition-all h-12 hover:border-zinc-400 hover:bg-zinc-700 bg-zinc-800 rounded-full p-3 w-1/2"
      onClick={handleClick}>
      Start
    </button>
  )
}

export default StartSearchButton
