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
        path.node.attributes.unshift(
          t.jsxAttribute(
            t.jsxIdentifier('x-jsx'),
            t.stringLiteral(`${file}:${lineNumber}`)
          )
        )
      },
    },
  }
}
