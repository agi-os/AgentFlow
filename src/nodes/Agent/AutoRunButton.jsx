/**
 * Renders a button element with dynamic text and styles based on the autoRun state.
 * The button triggers the onClick function when clicked.
 * @param {Object} props - The props object containing onClick and autoRun.
 * @param {Function} props.onClick - The function to call when the button is clicked.
 * @param {boolean} props.autoRun - Determines the current state of auto-run (enabled or disabled).
 * @returns {JSX.Element} A button element with dynamic text and styles.
 */
const AutoRunButton = ({ onClick, autoRun }) => {
  // Determine the button text based on the autoRun state
  const buttonText = autoRun ? 'Disable AutoRun' : 'Enable AutoRun'

  // Define CSS classes based on the autoRun state
  const classNames = [
    'transition-all',
    autoRun ? 'hover:bg-green-700' : 'hover:bg-red-700',
    autoRun ? 'bg-green-800' : 'bg-red-800',
    'rounded-full',
    'p-3',
    'w-1/2',
  ]

  // Render the button
  return (
    <button className={classNames.join(' ')} onClick={onClick}>
      {buttonText}
    </button>
  )
}

export default AutoRunButton
