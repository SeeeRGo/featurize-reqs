'use client'
import { Button, TextField } from '@mui/material';
import { mockData } from '~/constants';
import { Controller, FormProvider, useForm } from 'react-hook-form'

import { Epic, EstimateColumn } from '~/types';
import { EpicTree } from '../_components/EpicTree';
import { EstimateMatrix } from '../_components/EstimatesSubForm';
import { calculateTotal } from '../_utils/calculateScore';
import { getEpicsWithContextsStepResponse } from '../_utils/stepFeaturizePrompts';

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
        const { finalPercent } = await calculateTotal(mockData, [])
        console.log('finalPercent', finalPercent);
      }}>Rate</Button>
      <FormProvider {...methods}>
        <EstimateMatrix />
        <Controller name="name" render={({ field }) => <TextField label="Название проекта" {...field} />} />
        <EpicTree />
      </FormProvider>
    </main>
  );
}
