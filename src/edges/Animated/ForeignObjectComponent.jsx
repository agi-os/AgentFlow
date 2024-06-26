import FirstItemOnBelt from './FirstItemOnBelt'

/**
 * Represents a foreign object component.
 * @param {Object} props - The component props.
 * @param {Object} props.sourceNode - The source node.
 * @param {Object} props.edge - The edge object.
 * @param {Object} props.divRef - The reference to the div element.
 * @returns {JSX.Element} The foreign object component.
 */
const ForeignObjectComponent = ({ sourceNode, edge, divRef }) => {
  return (
    <foreignObject x={0} y={0} width="1" height="1" overflow="visible">
      <div ref={divRef} xmlns="http://www.w3.org/1999/xhtml">
        {sourceNode.type === 'itemChest' ? (
          <FirstItemOnBelt edgeId={edge.id} />
        ) : (
          <div className="inset-0 text-4xl relative -left-8">📦</div>
        )}
      </div>
    </foreignObject>
  )
}

export default ForeignObjectComponent
