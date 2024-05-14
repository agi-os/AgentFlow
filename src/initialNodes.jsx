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
    id: 'chest-1',
    type: 'chest',
    position: { x: 450, y: 150 },
    data: {
      items: generateRandomAmountOfItems({ min: 42, max: 76 }),
    },
  },
  {
    id: 'chest-2',
    type: 'chest',
    position: { x: 100, y: 950 },
    data: {
      items: generateRandomAmountOfItems({ min: 3, max: 5 }),
    },
  },
  // {
  //   id: 'cc1',
  //   type: 'constantCombinator',
  //   position: { x: 50, y: 150 },
  //   data: {
  //     signals: [
  //       { id: 'signal1', name: 'signal1', count: 1 },
  //       { id: 'signal2', name: 'signal2', count: 2 },
  //     ],
  //   },
  // },
  // {
  //   id: 'ac1',
  //   type: 'arithmeticCombinator',
  //   position: { x: 950, y: 950 },
  //   data: {
  //     mode: 'add',
  //     value: 0,
  //   },
  // },
  {
    id: 'sp1',
    type: 'splitter',
    position: { x: 150, y: 550 },
    data: {},
  },
  {
    id: 'itemChest-1',
    type: 'itemChest',
    position: { x: 250, y: 150 },
  },
]

export default initialNodes
