import { faker } from '@faker-js/faker'

let professionalWorkEmojis = [
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

const types = Array.from({ length: professionalWorkEmojis.length }, () => ({
  name: faker.person.jobType(),
  emoji: randomArrayElement(professionalWorkEmojis),
}))

const createRandomProspect = () => {
  const id = window?.crypto?.randomUUID()?.slice(-4)
  const type = faker.helpers.arrayElement(types)

  let prospect = {
    id,
    name: faker.person.fullName(),
    title: faker.person.jobTitle(),
    type: type.name,
    emoji: type.emoji,
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

export const randomProspects = (num = 400) =>
  generateRandomAmountOfItems({
    min: num / 2,
    max: num * 2,
  })

const initialNodes = [
  {
    id: 'r8h-gbb',
    position: {
      x: 361.95404414359746,
      y: 858.9926711689403,
    },
    type: 'schema',
    data: {
      label: 'Node r8h-gbb',
    },
    measured: {
      width: 128,
      height: 144,
    },
    selected: false,
    dragging: false,
  },
  {
    id: 'u6d-qlc',
    position: {
      x: 491.1391899832662,
      y: 1071.4420998329292,
    },
    type: 'itemChest',
    data: {
      label: 'Node u6d-qlc',
    },
    measured: {
      width: 384,
      height: 384,
    },
    selected: false,
    dragging: false,
  },
  {
    id: 'tuk-8em',
    position: {
      x: 556.8059145332834,
      y: 552.658253693883,
    },
    type: 'agent',
    data: {
      label: 'Node tuk-8em',
      agentName: 'Webster',
      agentDescription:
        'An expert web search agent. The best at finding information on the web.',
      tools: 'search_internet',
    },
    measured: {
      width: 256,
      height: 339,
    },
    selected: false,
    dragging: false,
  },
  {
    id: 'lcc-r8a',
    position: {
      x: 395.94192806577723,
      y: -129.16195999692277,
    },
    type: 'entry',
    measured: {
      width: 576,
      height: 522,
    },
    selected: false,
    dragging: false,
  },
]

export default initialNodes
