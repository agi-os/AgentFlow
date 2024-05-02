import Input from './Input'

const classNames = ['pl-2', 'pb-1', 'text-slate-300', 'text-xs']

const Inputs = ({ inputs, data, onChange }) =>
  inputs.map(({ label, field }) => (
    <div key={field}>
      <div className={classNames.join(' ')}>{label}</div>
      <Input
        key={field}
        text={data[field]}
        onChange={event => onChange({ value: event.target.value, field })}
      />
    </div>
  ))

export default Inputs
