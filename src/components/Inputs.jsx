import Input from './Input'

const classNames = ['pl-2', 'pb-1', 'text-slate-300', 'text-xs']

import { useEffect } from 'react'

const Inputs = ({ inputs, data, onChange }) => {
  // Effect to set default values on initial render
  useEffect(() => {
    inputs.forEach(({ field, defaultValue }) => {
      if (defaultValue !== undefined && data[field] === undefined) {
        onChange({ value: defaultValue, field })
      }
    })
  }, [data, inputs, onChange]) // Empty dependency array to run only once on mount

  return inputs.map(({ label, field, defaultValue }) => (
    <div key={field}>
      <div className={classNames.join(' ')}>{label}</div>
      <Input
        key={field}
        text={data[field] ?? defaultValue}
        onChange={event => onChange({ value: event.target.value, field })}
      />
    </div>
  ))
}
export default Inputs
