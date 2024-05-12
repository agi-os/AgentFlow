/**
 * @typedef {Object} NodeInfoProps
 * @property {string} id
 * @property {string} type
 * @property {boolean} selected
 * @property {number} x
 * @property {number} y
 * @property {number} [width]
 * @property {number} [height]
 * @property {any} data
 */

/**
 * @param {NodeInfoProps} props
 */
const NodeInfo = ({ id, type, selected, x, y, width, height, data }) => {
  if (!width || !height) {
    return null
  }

  return (
    <div
      className="react-flow__devtools-nodeinfo"
      style={{
        position: 'absolute',
        transform: `translate(${x}px, ${y + height}px)`,
        width: width * 2,
      }}>
      <div>id: {id}</div>
      <div>type: {type}</div>
      <div>selected: {selected ? 'true' : 'false'}</div>
      <div>
        position: {x.toFixed(1)}, {y.toFixed(1)}
      </div>
      <div>
        dimensions: {width} × {height}
      </div>
      <div>data: {JSON.stringify(data, null, 2)}</div>
    </div>
  )
}

export default NodeInfo
