import CustomNode from '../CustomNode'
import SchemaNode from './Schema'
import EntryNode from './Entry'
import ResultNode from './Result'
import ActionNode from './Action'
import ActionsNode from './Actions'
import AgentNode from './Agent'
import ToolNode from './Tool'
import WorkbenchNode from './Workbench'
import ChestNode from './Chest/index.jsx'
import ConstantCombinatorNode from './ConstantCombinator'
import ArithmeticCombinator from './ArithmeticCombinator'
import SplitterNode from './Splitter'
import ItemChestNode from './ItemChest/index'
import { InputPortal, OutputPortal } from './Portal/index'

export default {
  agent: AgentNode,
  custom: CustomNode,
  schema: SchemaNode,
  entry: EntryNode,
  result: ResultNode,
  action: ActionNode,
  actions: ActionsNode,
  tool: ToolNode,
  workbench: WorkbenchNode,
  chest: ChestNode,
  constantCombinator: ConstantCombinatorNode,
  arithmeticCombinator: ArithmeticCombinator,
  splitter: SplitterNode,
  itemChest: ItemChestNode,
  inputPortal: InputPortal,
  outputPortal: OutputPortal,
}
