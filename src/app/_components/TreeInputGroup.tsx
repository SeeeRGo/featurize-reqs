import { Stack } from "@mui/material"
import { InputTreeField } from "./InputTreeField"

interface IProps {
  labelSuffix: string
  onChange: (...event: any[]) => void
  value: any
}
export const TreeInputGroup = ({ labelSuffix, value, onChange}: IProps) => {
  return (
    <Stack rowGap={1}>
      <InputTreeField label={`Название ${labelSuffix}`} value={value} onChange={onChange} valueFieldName="name" />
      <InputTreeField label={`Контекст ${labelSuffix}`} value={value} onChange={onChange} valueFieldName="context" />
    </Stack>
  )
}