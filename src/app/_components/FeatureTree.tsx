import { Button } from "@mui/material"
import { SimpleTreeView, TreeItem } from "@mui/x-tree-view"
import { Controller, useFormContext } from "react-hook-form"
import { Feature } from "~/types"
import { TaskTree } from "./TaskTree"
import { TreeInputGroup } from "./TreeInputGroup"
interface IProps {
  epicId: number
}
export const FeatureTree = ({ epicId }: IProps) => {
  const { setValue, watch } = useFormContext()
  const features: Feature[] = watch(`epics[${epicId}].features`, [])
  return (
    <SimpleTreeView>
      {features.map((_, i) => <Controller
        key={i}
        name={`epics[${epicId}].features[${i}]`}
        render={({ field: { onChange, value }}) => (
          <TreeItem 
            itemId={`epics[${epicId}].features[${i}]`} 
            label={<TreeInputGroup labelSuffix="фичи" value={value} onChange={onChange} />}
          >
            <TaskTree epicId={epicId} featureId={i} />
          </TreeItem>
        )}
      />)}
      <TreeItem itemId={`add_feature_epic${epicId}`} label={<Button onClick={() => {
        setValue(`epics[${epicId}].features[${features.length}]`, {
          id: features.length + 1,
          name: '',
          context: '',
          tasks: []
        })
      }}>Add Feature</Button>}/>
    </SimpleTreeView>
  )
}