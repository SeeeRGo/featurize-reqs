import { Stack, TextField } from "@mui/material"
import { InputTreeField } from "./InputTreeField"
import { Controller } from "react-hook-form"

interface IProps {
  labelSuffix: string
  fieldNamePrefix: string
}
export const TreeInputGroup = ({ labelSuffix, fieldNamePrefix}: IProps) => {
  return (
    <Stack rowGap={1}>
      <Controller
        name={`${fieldNamePrefix}.name`}
        render={({ field: { onChange, value } }) => (
          <TextField fullWidth label={`Название ${labelSuffix}`} onClick={(e) => { e.stopPropagation() } } onChange={onChange} value={value} />
        )}
      />
      <Controller
        name={`${fieldNamePrefix}.context`}
        render={({ field: { onChange, value } }) => (
          <TextField fullWidth label={`Контекст ${labelSuffix}`} onClick={(e) => { e.stopPropagation() } } onChange={onChange} value={value} />
        )}
      />
    </Stack>
  )
}