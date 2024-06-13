import Belt from './Belt'
import Animated from './Animated/index'
import Queue from './Queue/index'
import Signal from './Signal/index'
import TransportBelt from './TransportBelt'

const edgeTypes = {
  belt: Belt,
  animated: Animated,
  queue: Queue,
  signal: Signal,
  transport: TransportBelt,
}

export default edgeTypes
