import { faker } from '@faker-js/faker'

let professionalWorkEmoticons = [
  '💼',
  '📊',
  '📈',
  '📚',
  '📝',
  '✅',
  '🚀',
  '🔍',
  '📅',
  '📌',
  '📥',
  '📤',
]

const randomArrayElement = array => {
  const index = Math.floor(Math.random() * array.length)
  const element = array[index]
  array.splice(index, 1)
  return element
}

const types = Array.from({ length: professionalWorkEmoticons.length }, () => ({
  name: faker.person.jobType(),
  emoticon: randomArrayElement(professionalWorkEmoticons),
}))

const createRandomProspect = () => {
  const id = window?.crypto?.randomUUID()?.slice(-4)
  const type = faker.helpers.arrayElement(types)

  let prospect = {
    id,
    name: faker.person.fullName(),
    title: faker.person.jobTitle(),
    type: type.name,
    emoticon: type.emoticon,
    phone: faker.helpers.fromRegExp(/[0-9]{3}-[0-9]{3}-[0-9]{4}/),
  }

  const extraDataPoints = Math.floor(Math.random() * 6) + 4 // generates a random number between 4 and 9

  for (let i = 0; i < extraDataPoints; i++) {
    const randomDataPoint = Math.floor(Math.random() * 10) // generates a random number between 0 and 9

    switch (randomDataPoint) {
      case 0:
        prospect.firstName = faker.person.firstName()
        break
      case 1:
        prospect.lastName = faker.person.lastName()
        break
      case 2:
        prospect.middleName = faker.person.middleName()
        break
      case 3:
        prospect.jobTitle = faker.person.jobTitle()
        break
      case 4:
        prospect.bio = faker.person.bio()
        break
      case 5:
        prospect.prefix = faker.person.prefix()
        break
      case 6:
        prospect.suffix = faker.person.suffix()
        break
      case 7:
        prospect.jobDescriptor = faker.person.jobDescriptor()
        break
      case 8:
        prospect.jobArea = faker.person.jobArea()
        break
      case 9:
        prospect.zodiacSign = faker.person.zodiacSign()
        break
      default:
        break
    }
  }

  return prospect
}

const generateRandomAmountOfItems = ({ min = 3, max = 16 }) => {
  const amount = faker.number.int({ min, max })
  return Array.from({ length: amount }, createRandomProspect)
}

export const randomProspects = generateRandomAmountOfItems({
  min: 300,
  max: 500,
})

const initialNodes = [
  {
    id: 'wau-wrm',
    position: {
      x: 123,
      y: 285,
    },
    type: 'itemChest',
    data: {
      label: 'Node wau-wrm',
    },
  },
  {
    id: 'x7t-r99',
    position: {
      x: 418,
      y: 48,
    },
    type: 'outputPortal',
    data: {
      label: 'Node x7t-r99',
    },
  },
  {
    id: 'arx-cu6',
    position: {
      x: 423,
      y: 864,
    },
    type: 'inputPortal',
    data: {
      label: 'Node arx-cu6',
    },
  },
]

export default initialNodes
