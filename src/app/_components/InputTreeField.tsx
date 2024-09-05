import { TextField } from "@mui/material"

interface IProps {
  label: string
  onChange: (...event: any[]) => void
  value: any
}
export const InputTreeField = ({ label, onChange, value }: IProps) => {
  return (
    <TextField label={label} onClick={(e) => { e.stopPropagation() } } onChange={onChange} value={value} />
  )
}