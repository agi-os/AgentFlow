import CustomNode from '../CustomNode'
import SchemaNode from './Schema'
import EntryNode from './Entry'
import ResultNode from './Result'
import EmitNode from './Emit'
import ActionNode from './Action'
import ActionsNode from './Actions'
import AgentNode from './Agent'

export default {
  agent: AgentNode,
  custom: CustomNode,
  schema: SchemaNode,
  entry: EntryNode,
  result: ResultNode,
  emit: EmitNode,
  action: ActionNode,
  actions: ActionsNode,
}
