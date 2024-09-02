'use client'
import { Button, Stack, TextField, Typography } from '@mui/material';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { estimateColumns, mockData } from '~/constants';
import { Controller, FormProvider, useForm } from 'react-hook-form'

export default function Home() {
  const methods = useForm()
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <Stack direction="row">
        <SimpleTreeView>
          {mockData.map(epic => (
            <TreeItem itemId={`${epic.id}`} label={epic.name}>
              <SimpleTreeView>
                {epic.features.map(feature => (
                  <TreeItem itemId={`${epic.id}_${feature.id}`} label={feature.name}>
                    <FormProvider {...methods}>
                      <SimpleTreeView onItemClick={() => {}}>
                        {feature.tasks.map(task => (
                          <TreeItem itemId={`${epic.id}_${feature.id}_${task.id}`} label={<Stack direction="row">
                            <Typography>{task.name}</Typography>
                            {estimateColumns.map(({ name }, i) => <Controller name={`${task.id}.estimates[${i}]`} render={({ field }) => <TextField label={name} onClick={(e) => { e.stopPropagation()}} {...field} />} />)}
                          </Stack>} />
                        ))}
                      </SimpleTreeView>
                    </FormProvider>
                  </TreeItem>
                ))}
              </SimpleTreeView>
            </TreeItem>
          ))}
        </SimpleTreeView>
      </Stack>
      <Button onClick={methods.handleSubmit(data => { console.log('form data', data)})}>Log form state</Button>
    </main>
  );
}
