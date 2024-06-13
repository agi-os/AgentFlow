import Schema from './Schema/index'
import Entry from './Entry/index'
import Result from './Result'
import Action from './Action'
import Actions from './Actions'
import Agent from './Agent/index'
import ToolChest from './ToolChest/index'
import Workbench from './Workbench'
import Chest from './Chest/index.jsx'
import ConstantCombinator from './ConstantCombinator'
import ArithmeticCombinator from './ArithmeticCombinator'
import Splitter from './Splitter'
import ItemChest from './ItemChest/index'
import { InputPortal, OutputPortal } from './Portal/index'
import Database from './DatabaseNode.jsx'

import ErrorBoundary from './ErrorBoundary'
import CraftingAgentNode from './CraftingAgent/index.jsx'
import WebAgent from './WebAgent/index.jsx'

const components = {
  agent: Agent,
  schema: Schema,
  entry: Entry,
  result: Result,
  action: Action,
  actions: Actions,
  tool: ToolChest,
  workbench: Workbench,
  chest: Chest,
  constantCombinator: ConstantCombinator,
  arithmeticCombinator: ArithmeticCombinator,
  splitter: Splitter,
  itemChest: ItemChest,
  inputPortal: InputPortal,
  outputPortal: OutputPortal,
  database: Database,
  craftingAgent: CraftingAgentNode,
  webAgent: WebAgent,
}

const WrappedComponents = Object.keys(components).reduce((acc, key) => {
  const Component = components[key]
  acc[key] = props => (
    <ErrorBoundary>
      <Component {...props} />
    </ErrorBoundary>
  )
  return acc
}, {})

export default WrappedComponents
