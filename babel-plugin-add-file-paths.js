export default function ({ types: t }) {
  return {
    visitor: {
      JSXOpeningElement(path, state) {
        const { node } = path

        // Ignore the Fragment element.
        if (
          (t.isJSXIdentifier(node.name) &&
            node.name &&
            (node.name.name === 'React.Fragment' ||
              node.name.name === 'Fragment')) ||
          t.isJSXFragment(node)
        ) {
          return
        }

        // Get the full path of the file.
        const fullPath = state.file.opts.filename

        // Remove everything up to 'src' in the path.
        let parts = fullPath.split('/')
        while (parts.length && parts[0] !== 'src') {
          parts.shift()
        }
        parts.shift()

        // Keep only the last 3 parts of the path.
        parts = parts.slice(-3)

        let file = parts.join('/')

        // Remove the file extension.
        parts = file.split('.')
        parts.pop()
        file = parts.join('.')

        // Get the line number.
        const lineNumber = path.node.loc.start.line

        // Add the file path as a data attribute.
        const jsxAttribute = t.jsxAttribute(
          t.jsxIdentifier('x-jsx'),
          t.stringLiteral(`${file}:${lineNumber}`)
        )

        // Find x-jsx attribute
        let xJsxIndex = path.node.attributes.findIndex(
          attr => attr?.name && attr?.name?.name === 'x-jsx'
        )

        // If x-jsx exists, don't add it again
        if (xJsxIndex !== -1) {
          return
        }

        // Find x-id attribute
        let xIdIndex = path.node.attributes.findIndex(
          attr => attr?.name && attr?.name?.name === 'x-id'
        )
        let xIdAttribute

        // If x-id exists, remove it from its current position
        if (xIdIndex !== -1) {
          xIdAttribute = path.node.attributes[xIdIndex]
          path.node.attributes.splice(xIdIndex, 1)
        }

        if (!xIdAttribute) {
          // Add x-jsx at the beginning of the attributes array
          path.node.attributes.unshift(jsxAttribute)
        } else {
          // Add x-id and x-jsx at the beginning of the attributes array
          path.node.attributes.unshift(xIdAttribute, jsxAttribute)
        }
      },
    },
  }
}
