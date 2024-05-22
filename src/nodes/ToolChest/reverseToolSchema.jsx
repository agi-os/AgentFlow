export const reverseToolSchema = schema => {
  const functionName = schema.function.name
  const functionDescription = schema.function.description
  const propertyName = Object.keys(schema.function.parameters.properties)[0]
  const propertyType = schema.function.parameters.properties[propertyName].type
  const propertyDescription =
    schema.function.parameters.properties[propertyName].description

  return {
    functionName,
    functionDescription,
    propertyName,
    propertyType,
    propertyDescription,
  }
}
