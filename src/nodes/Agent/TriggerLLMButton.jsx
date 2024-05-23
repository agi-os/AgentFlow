/**
 * Renders a button to trigger a LLM call if enabled, otherwise displays a message.
 * @param {Function} onClick - The function to be called when the button is clicked.
 * @param {boolean} enabled - Flag to determine if the button is enabled or disabled.
 * @returns {JSX.Element} - A button element to trigger LLM call if enabled, or a message if disabled.
 */
const TriggerLLMButton = ({ onClick, enabled }) => {
  const handleClick = onClick || (() => {})

  return enabled ? (
    <button
      className="border border-zinc-600 transition-all hover:border-zinc-400 hover:bg-zinc-700 bg-zinc-800 rounded-full p-3 w-1/2"
      onClick={handleClick}>
      Trigger LLM Call
    </button>
  ) : (
    <div className="grid place-content-center text-balance text-center">
      Batch size not reached. Waiting for the batch size to reach the required
      amount.
    </div>
  )
}

export default TriggerLLMButton
