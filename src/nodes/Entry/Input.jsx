import { inputClassNames } from './constants'

const Input = ({ onChange, text, className, disabled = false }) => (
  <input
    onChange={onChange}
    value={text}
    className={inputClassNames.concat(className).join(' ')}
    disabled={disabled}
  />
)

export default Input
