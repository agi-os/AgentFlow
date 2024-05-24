import Input from './Input'

import { useEffect } from 'react'

const Inputs = ({
  inputs,
  data,
  onChange,
  classNames = ['grid', 'grid-cols-12', 'gap-x-4', 'gap-y-3'],
  labelClassNames = ['pl-2', 'pb-1', 'text-slate-300', 'text-xs'],
}) => {
  // Set default values on initial render
  useEffect(() => {
    inputs.forEach(({ field, defaultValue }) => {
      if (defaultValue !== undefined && data[field] === undefined) {
        onChange({ value: defaultValue, field })
      }
    })
  }, [data, inputs, onChange])

  return (
    <div className={classNames.join(' ')}>
      {inputs.map(
        ({ label, field, defaultValue, inputClassNames, classNames }) => (
          <Input
            key={field}
            classNames={classNames}
            inputClassNames={inputClassNames}
            text={data[field] ?? defaultValue}
            onChange={event => onChange({ value: event.target.value, field })}>
            <div className={labelClassNames.join(' ')}>{label}</div>
          </Input>
        )
      )}
    </div>
  )
}
export default Inputs
