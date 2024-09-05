'use client'
import { Button, TextField } from '@mui/material';
import { mockData } from '~/constants';
import { Controller, FormProvider, useForm } from 'react-hook-form'

import { Epic, EstimateColumn } from '~/types';
import { EpicTree } from '../_components/EpicTree';
import { EstimateMatrix } from '../_components/EstimatesSubForm';
import { calculateTotal } from '../_utils/calculateScore';
import { getEpicsWithContextsStepResponse } from '../_utils/stepFeaturizePrompts';
import { createClient } from '@supabase/supabase-js';
import { datasetFeatures, extractFeaturesFromDbProject } from '../_utils/extractFeaturesForDataset';
import { datasetTasks, extractTasksFromDbProject } from '../_utils/extractTasksForDataset';
import { datasetEpicsContexts } from '../_utils/extractEpicsContextsForDataset';
import { datasetEpics } from '../_utils/extractEpicsForDataset';

// const aiEpics: any[] = 
// const aiData4o: any[] = 
// const aiOnlyEpicsMini: any[] = 
// const aiEpicsFeaturesMini: any[] =
export default function Projects() {
  const methods = useForm<{epics: Epic[], name: string, estimate_matrix: EstimateColumn[] }>()

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      {/* <Button onClick={methods.handleSubmit(async data => {
        await supabase.from('fr_projects').insert(data)
      })}>Create Form</Button> */}
      <Button onClick={async () => {
        // await getResponse()
        // await getEpicsWithContextsStepResponse()
        // await extractFeaturesFromDbProject(3)
        // await extractTasksFromDbProject(3)
        // await datasetFeatures()
        // await datasetTasks()
        await datasetEpics()
        await datasetEpicsContexts()
        // const { finalPercent } = await calculateTotal(mockData, [])
        // console.log('finalPercent', finalPercent);
      }}>Rate</Button>
      <FormProvider {...methods}>
        <EstimateMatrix />
        <Controller name="name" render={({ field }) => <TextField label="Название проекта" {...field} />} />
        <EpicTree />
      </FormProvider>
    </main>
  );
}
