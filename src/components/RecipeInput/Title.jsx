/**
 * Title function component
 *
 * @param {Object} props - The properties object containing 'children' property
 * @returns {JSX.Element} A div element with specified class name and children content
 */
const Title = ({ children }) => (
  <div className="text-zinc-600 mb-3 text-xs">{children}</div>
)

export default Title
