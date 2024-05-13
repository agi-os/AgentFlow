/**
 * Centers its children vertically and horizontally.
 * @param {Object} props - The component props.
 * @param {ReactNode} props.children - The children elements to be centered.
 * @returns {JSX.Element} The centered component.
 */
export const Centered = ({ children }) => (
  <div
    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
  ">
    {children}
  </div>
)
