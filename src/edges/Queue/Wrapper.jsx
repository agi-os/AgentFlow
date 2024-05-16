/**
 * Represents a foreign object component.
 * @param {Object} props - The component props.
 * @param {Object} props.edge - The edge object.
 * @param {Object} props.divRef - The reference to the div element.
 * @returns {JSX.Element} The foreign object component.
 */
const Wrapper = ({ children, divRef }) => {
  return (
    <foreignObject x={0} y={0} width="1" height="1" overflow="visible">
      <div ref={divRef} xmlns="http://www.w3.org/1999/xhtml">
        {children}
      </div>
    </foreignObject>
  )
}

export default Wrapper
