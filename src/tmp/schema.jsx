import SchemaButton from './SchemaButton'

const schema = {
  age: {
    type: 'number',
    constraints: {
      min: 0,
      max: 120,
    },
    description: 'The age of the user',
  },
  firstName: {
    type: 'string',
    description:
      'The first name of the user, lowercase with capital first letter',
  },
  surname: {
    type: 'string',
    description: 'The surname of the user, lowercase with capital first letter',
  },
  sex: {
    type: 'enum',
    constraints: {
      values: ['M', 'F'],
    },
    description: 'The sex of the user, guess if not provided',
  },
}

const searchSchema = {
  purpose: {
    type: 'string',
    description: 'Reason for executing the search',
  },
  query: {
    type: 'string',
    description: 'Search query to be executed',
  },
  type: {
    type: 'enum',
    constraints: {
      values: ['VIDEO', 'EMAIL'],
    },
    description: 'Type of search to be executed',
  },
}

const multiSearchSchema = {
  searches: {
    type: 'array',
    items: searchSchema,
    description: 'Array of searches to be executed',
  },
}

const toolkitSchema = {
  purpose: {
    type: 'string',
    description: 'Reason for using the chosen tool',
  },
  tool: {
    type: 'enum',
    constraints: {
      values: ['webSearch', 'webScrape', 'reflection', 'planning'],
    },
    description: 'The tool to be used',
  },
  args: {
    type: 'string',
    description: 'Argument to be passed to the tool',
  },
}

const multiToolkitSchema = {
  actions: {
    type: 'array',
    items: toolkitSchema,
    description: 'Array of actions to be executed',
  },
}

export const buttonsOld = [
  // { schema: {}, label: '🗒️ Notepad', secondParam: 'notepad' },
  // { schema: {}, label: '🗃️ Archive', secondParam: 'archive' },
  { schema: searchSchema, label: '🧬 Search schema' },
  { schema: multiSearchSchema, label: 'Multi search schema' },
  { schema: toolkitSchema, label: 'Toolkit schema' },
  { schema: multiToolkitSchema, label: 'Multi toolkit schema' },
  // { schema: {}, label: ' Emit', secondParam: 'emit' },
  { schema: {}, label: 'Actions', secondParam: 'actions' },
  { schema: {}, label: '🗄️ Chest', secondParam: 'chest' },

  {
    schema: {},
    label: '🔢 Constant Combinator',
    secondParam: 'constantCombinator',
  },
  { schema: {}, label: 'Splitter', secondParam: 'splitter' },
  { schema: schema, label: '🧬 Schema' },
  { schema: {}, label: '🛠️ Tool', secondParam: 'tool' },
  { schema: {}, label: '🏗️ Workbench', secondParam: 'workbench' },
  { schema: {}, label: '🐣 Action', secondParam: 'action' },
  { schema: {}, label: '🛎️ Result', secondParam: 'result' },
]

export const buttons = [
  { schema: {}, label: '✏️ Entry', secondParam: 'entry' },
  { schema: {}, label: '🗄️ Item Chest', secondParam: 'itemChest' },
  { schema: {}, label: '🧑‍💼 Agent', secondParam: 'agent' },
  { schema: {}, label: '🔗 InPortal', secondParam: 'inputPortal' },
  { schema: {}, label: '🔗 OutPortal', secondParam: 'outputPortal' },
]
