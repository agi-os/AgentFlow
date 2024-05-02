import CustomNode from '../CustomNode'
import SchemaNode from './Schema'
import EntryNode from './Entry'
import ResultNode from './Result'
import ActionNode from './Action'
import ActionsNode from './Actions'
import AgentNode from './Agent'
import ToolNode from './Tool'
import WorkbenchNode from './Workbench'

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
}
