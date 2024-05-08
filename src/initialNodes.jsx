import { faker } from '@faker-js/faker'

const createRandomProspect = () => {
  const id = faker.helpers.fromRegExp(/person-[0-9]{3}/)

  return {
    id,
    name: faker.person.fullName(),
    title: faker.person.jobTitle(),
    type: faker.person.jobType(),
    phone: faker.helpers.fromRegExp(/[0-9]{3}-[0-9]{3}-[0-9]{4}/),
  }
}

const generateRandomAmountOfItems = (count = 10) => {
  const amount = faker.number.int({ min: 3, max: count })
  return Array.from({ length: amount }, createRandomProspect)
}

const initialNodes = [
  {
    id: 'chest-1',
    type: 'chest',
    position: { x: 500, y: 200 },
    data: {
      items: generateRandomAmountOfItems(),
    },
  },
  {
    id: 'chest-2',
    type: 'chest',
    position: { x: 100, y: 900 },
    data: {
      items: generateRandomAmountOfItems(3),
    },
  },
  {
    id: 'cc1',
    type: 'constantCombinator',
    position: { x: 50, y: 150 },
    data: {
      signals: [
        { id: 'signal1', name: 'signal1', count: 1 },
        { id: 'signal2', name: 'signal2', count: 2 },
      ],
    },
  },
]

export default initialNodes
