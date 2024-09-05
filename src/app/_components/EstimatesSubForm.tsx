import { Button, FormControl, InputLabel, MenuItem, OutlinedInput, Select, Stack, TextField } from "@mui/material"
import { Fragment } from "react"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import { EstimateColumn } from "~/types"

export const EstimateMatrix = () => {
  const { setValue } = useFormContext()
  const estimates: EstimateColumn[] = useWatch({ name: 'estimate_matrix', defaultValue: []})
  return (
    <Stack sx={{ width: '100%' }} rowGap={1}>
      {estimates.map(({ id, type, name, ...rest }, i) => <Fragment key={i}>
        <Controller
          name={`estimate_matrix[${i}].type`}
          render={({ field }) => <FormControl fullWidth>
          <InputLabel id={`estimate_matrix[${i}].type-label`}>Column Type</InputLabel>
          <Select
            labelId={`estimate_matrix[${i}].type-label`}
            input={<OutlinedInput label="Column Type" />}
            {...field}
          >
            <MenuItem value="regular">Regular</MenuItem>
            <MenuItem value="multiplier">Multiplier</MenuItem>
          </Select>
        </FormControl>}
        />
        <Controller name={`estimate_matrix[${i}].name`} render={({ field }) => <TextField label="Название оценки" {...field} />} />
        {type === 'multiplier' ? (
          <>
            <Controller name={`estimate_matrix[${i}].multiplier`} render={({ field }) => <TextField label="Множитель" type="number" {...field} />} />
            <Controller
              name={`estimate_matrix[${i}].referenceColumnId`}
              render={({ field }) => <FormControl fullWidth>
              <InputLabel id={`estimate_matrix[${i}].referenceColumnId-label`}>Reference Column Id</InputLabel>
              <Select
                labelId={`estimate_matrix[${i}].referenceColumnId-label`}
                input={<OutlinedInput label="Reference Column Id" />}
                {...field}
              >
                {estimates.map((_, index) => <MenuItem key={index} value={index}>{index}</MenuItem>).filter((_, index) => index !== i)}
              </Select>
            </FormControl>}
            />
          </>
        ) : null}
      </Fragment>)}
      <Button onClick={() => {
        setValue(`estimate_matrix[${estimates.length}]`, {
          id: estimates.length + 1,
          type: 'regular',
          name: ''
        })
      }}>Add Estmate Dimension</Button>
    </Stack>
    
  )
} 