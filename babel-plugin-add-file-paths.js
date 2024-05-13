export default function ({ types: t }) {
  return {
    visitor: {
      JSXOpeningElement(path, state) {
        // Get the full path of the file.
        const fullPath = state.file.opts.filename

        // Remove everything up to 'src' in the path.
        let parts = fullPath.split('/')
        while (parts.length && parts[0] !== 'src') {
          parts.shift()
        }
        parts.shift()
        let file = parts.join('/')

        // Remove the file extension.
        parts = file.split('.')
        parts.pop()
        file = parts.join('.')

        // Add the file path as a data attribute.
        path.node.attributes.push(
          t.jsxAttribute(t.jsxIdentifier('data-file'), t.stringLiteral(file))
        )
      },
    },
  }
}
