import { Button } from "@mui/material"
import { SimpleTreeView, TreeItem } from "@mui/x-tree-view"
import { Controller, useFormContext } from "react-hook-form"
import { Task } from "~/types"
import { TreeInputGroup } from "./TreeInputGroup"
interface IProps {
  tasks?: Task[]
  epicId: number
  featureId: number
}
export const TaskTree = ({ epicId, featureId }: IProps) => {
  const { setValue, watch } = useFormContext()
  const tasks: Task[] = watch(`epics[${epicId}].features[${featureId}].tasks`, [])

  return (
    <SimpleTreeView>
    {tasks.map((_, index) => (
      <Controller
        key={index}
        name={`epics[${epicId}].features[${featureId}].tasks[${index}]`}
        render={({ field: { onChange, value } }) => (
          <TreeItem 
            itemId={`epics[${epicId}].features[${featureId}].tasks[${index}]`} 
            label={<TreeInputGroup labelSuffix="таски" value={value} onChange={onChange} />} 
          />
        )}
      />
    ))}
    <TreeItem itemId={`add_task_epic${epicId}_feature${featureId}`} label={<Button onClick={() => {
      console.log('adding task', tasks);
      setValue(`epics[${epicId}].features[${featureId}].tasks[${tasks.length}]`, {
        id: tasks.length + 1,
        name: '',
        context: '',
        estimates: []
      })
      
    }}>Add Task</Button>}/>
  </SimpleTreeView>
  )
}