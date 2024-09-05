import { Button } from "@mui/material"
import { SimpleTreeView, TreeItem } from "@mui/x-tree-view"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import { Epic } from "~/types"
import { FeatureTree } from "./FeatureTree"
import { TreeInputGroup } from "./TreeInputGroup"

export const EpicTree = () => {
  const { setValue, control } = useFormContext()
  const epics: Epic[] = useWatch({ name: `epics`, control })
  
  return (
    <SimpleTreeView sx={{ width: '100%' }}>
      {epics && epics.map((_, i) => <TreeItem 
            key={i}
            itemId={`epics[${i}]`} 
            label={<TreeInputGroup fieldNamePrefix={`epics[${i}]`} labelSuffix="эпика" />}
          >
            <FeatureTree epicId={i} />
          </TreeItem>)}
      <TreeItem itemId={`add_epic`} label={<Button onClick={() => {
        setValue(`epics[${epics?.length ?? 0}]`, {
          id: (epics?.length ?? 0) + 1,
          name: '',
          context: '',
          features: []
        })
      }}>Add Epic</Button>}/>
  </SimpleTreeView>
  )
}