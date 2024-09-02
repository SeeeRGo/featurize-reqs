'use client'
import { Button, Stack, TextField, Typography } from '@mui/material';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { estimateColumns, mockData } from '~/constants';
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { useState } from 'react';

export default function Home() {
  const methods = useForm()
  const [epics, setEpics] = useState<string[]>();
  const [features, setFeatures] = useState<string[]>();
  const [tasks, setTasks] = useState<string[]>();
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <Button>Create Form</Button>
      <SimpleTreeView>
        {epics && epics.map((epic, i) => <TreeItem itemId={`epic_${i}`} label={`epic_${i}`}>
          <SimpleTreeView>
            {features && features.map((_, ind) => <TreeItem itemId={`features_${ind}`} label={`features_${ind}`}>
              <SimpleTreeView>
                {tasks && tasks.map((_, index) => <TreeItem itemId={`tasks_${index}`} label={`tasks_${index}`} />)}
                <TreeItem itemId='1-1-1' label={<Button onClick={() => setTasks([...tasks ?? [], 'new task'])}>Add Task</Button>}/>
              </SimpleTreeView>
            </TreeItem>)}
            <TreeItem itemId='1-1' label={<Button onClick={() => setFeatures([...features ?? [], 'new feature'])}>Add Feature</Button>}/>
          </SimpleTreeView>
        </TreeItem>)}
        <TreeItem itemId='1' label={<Button onClick={() => setEpics([...epics ?? [], 'new epic'])}>Add Epic</Button>}/>
      </SimpleTreeView>
    </main>
  );
}
