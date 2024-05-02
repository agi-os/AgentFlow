import Input from './Input'

const Inputs = ({ inputs, data, onChange }) =>
  inputs.map(({ label, field }) => (
    <div key={field}>
      <div className="pl-2 pb-1 text-slate-300 text-xs">{label}</div>
      <Input
        key={field}
        text={data[field]}
        onChange={event => onChange({ value: event.target.value, field })}
      />
    </div>
  ))

export default Inputs
