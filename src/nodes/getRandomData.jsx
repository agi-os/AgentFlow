import { faker } from '@faker-js/faker'

export const templates = {
  file: [
    { key: 'type', value: 'file' },
    { key: 'emoji', value: '📄' },
    { key: 'name', generator: faker.system.fileName },
    { key: 'extension', generator: faker.system.fileExt },
    { key: 'path', generator: faker.system.filePath },
  ],
  product: [
    { key: 'type', value: 'product' },
    { key: 'emoji', value: '🛍️' },
    { key: 'name', generator: faker.commerce.productName },
    { key: 'price', generator: faker.commerce.price },
    { key: 'description', generator: faker.commerce.productDescription },
  ],
  website: [
    { key: 'type', value: 'website' },
    { key: 'emoji', value: '🌐' },
    { key: 'name', generator: faker.company.catchPhrase },
    { key: 'url', generator: faker.internet.domainName },
    { key: 'description', generator: () => faker.word.words(5) },
  ],
  person: [
    { key: 'type', value: 'person' },
    { key: 'emoji', value: '👤' },
    { key: 'name', generator: faker.person.fullName },
    { key: 'email', generator: faker.internet.exampleEmail },
    { key: 'phone', generator: faker.phone.number },
  ],
  address: [
    { key: 'type', value: 'address' },
    { key: 'emoji', value: '🏠' },
    { key: 'street', generator: faker.location.street },
    { key: 'city', generator: faker.location.city },
    { key: 'state', generator: faker.location.state },
    { key: 'zip', generator: faker.location.zipCode },
  ],
  company: [
    { key: 'type', value: 'company' },
    { key: 'emoji', value: '🏢' },
    { key: 'name', generator: faker.company.name },
    { key: 'industry', generator: faker.commerce.department },
    { key: 'catchPhrase', generator: faker.company.catchPhrase },
  ],
  vehicle: [
    { key: 'type', value: 'vehicle' },
    { key: 'emoji', value: '🚗' },
    { key: 'make', generator: faker.vehicle.manufacturer },
    { key: 'model', generator: faker.vehicle.model },
    {
      key: 'year',
      generator: () => faker.date.past({ years: 15 }).getFullYear(),
    },
    { key: 'vin', generator: faker.vehicle.vin },
  ],
  parcel: [
    { key: 'type', value: 'parcel' },
    { key: 'emoji', value: '📦' },
    { key: 'weight', generator: () => faker.number.int(2000) },
    {
      key: 'contents',
      generator: () => {
        const name =
          faker.company.catchPhraseAdjective() +
          ' ' +
          faker.science.chemicalElement().name
        return name.charAt(0).toUpperCase() + name.slice(1)
      },
    },
  ],
  food: [
    { key: 'type', value: 'food' },
    { key: 'emoji', value: '🍔' },
    { key: 'name', value: 'Burger' },
    { key: 'price', generator: faker.commerce.price },
    { key: 'description', generator: faker.lorem.sentence },
  ],
  event: [
    { key: 'type', value: 'event' },
    { key: 'emoji', value: '🎉' },
    {
      key: 'name',
      generator: () => {
        const name =
          faker.company.catchPhraseAdjective() + ' ' + faker.company.buzzVerb()
        return name.charAt(0).toUpperCase() + name.slice(1)
      },
    },
    { key: 'date', generator: faker.date.future },
    { key: 'location', generator: faker.location.city },
  ],
  dog: [
    { key: 'type', value: 'dog' },
    { key: 'emoji', value: '🐶' },
    {
      key: 'name',
      generator: () => {
        const name =
          faker.company.catchPhraseDescriptor() + faker.word.interjection()
        return name.charAt(0).toUpperCase() + name.slice(1)
      },
    },
    { key: 'breed', generator: faker.animal.dog },
    { key: 'age', generator: () => faker.number.int(15) },
  ],
  fish: [
    { key: 'type', value: 'fish' },
    { key: 'emoji', value: '🐟' },
    {
      key: 'name',
      generator: () => {
        const name = faker.word.noun()
        return name.charAt(0).toUpperCase() + name.slice(1)
      },
    },
    { key: 'species', generator: faker.animal.fish },
    { key: 'length', generator: () => faker.number.int(100) },
  ],
  cat: [
    { key: 'type', value: 'cat' },
    { key: 'emoji', value: '🐱' },
    {
      key: 'name',
      generator: () => {
        const name = faker.word.noun() + 'y ' + faker.person.middleName()
        return name.charAt(0).toUpperCase() + name.slice(1)
      },
    },
    { key: 'breed', generator: faker.animal.cat },
    { key: 'age', generator: () => faker.number.int(15) },
  ],
  horse: [
    { key: 'type', value: 'horse' },
    { key: 'emoji', value: '🐴' },
    {
      key: 'name',
      generator: () => {
        const name = [faker.company.buzzAdjective(), faker.word.verb()]
        return name.map(n => n.charAt(0).toUpperCase() + n.slice(1)).join(' ')
      },
    },
    { key: 'breed', generator: faker.animal.horse },
    { key: 'age', generator: () => faker.number.int(30) },
  ],
}

export const getRandomData = type => {
  // Select a random type if none is provided
  const selectedType =
    type || faker.helpers.arrayElement(Object.keys(templates))

  // Prepare the selected type, fallback to file template
  const selectedTemplate = templates[selectedType] || templates.file

  // Sanity check of all generators in the selectedType
  selectedTemplate.forEach(item => {
    if (item.generator) {
      if (typeof item.generator !== 'function') {
        throw new Error(
          `Invalid generator for key "${item.key}" in type "${type}"`
        )
      }
    }
  })

  // Generate random data based on the template
  const data = selectedTemplate.map(item => ({
    key: item.key,
    value: String(item.generator ? item.generator() : item.value),
  }))

  // Filter out empty keys
  return data.filter(({ value }) => value.trim() !== '')
}

export default getRandomData
