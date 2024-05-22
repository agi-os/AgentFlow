export const generateToolSchema = ({
  functionName,
  functionDescription,
  propertyName,
  propertyType,
  propertyDescription,
}) => {
  return {
    type: 'function',
    function: {
      name: functionName,
      description: functionDescription,
      parameters: {
        type: 'object',
        properties: {
          [propertyName]: {
            type: propertyType,
            description: propertyDescription,
          },
        },
        required: [propertyName],
      },
    },
  }
}
