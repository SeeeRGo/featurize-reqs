import { TextField } from "@mui/material"

interface IProps {
  label: string
  valueFieldName: string
  onChange: (...event: any[]) => void
  value: any
}
export const InputTreeField = ({ label, onChange, value, valueFieldName }: IProps) => {
  return (
    <TextField label={label} onClick={(e) => { e.stopPropagation() } } onChange={(ev) => {
      onChange({
        ...ev,
        target: {
          ...ev.target,
          value: {
            ...value,
            [valueFieldName]: ev.target.value
          }
        }
      })
      
    }} value={value[valueFieldName]} />
  )
}