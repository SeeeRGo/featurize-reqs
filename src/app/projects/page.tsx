'use client'
import { Button, Stack, TextField, Typography } from '@mui/material';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { docText, estimateColumns, mockData } from '~/constants';
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form'
import { useState } from 'react';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js'
import { TaskTree } from '../_components/TaskTree';
import { Epic, EstimateColumn, Feature, Task } from '~/types';
import { FeatureTree } from '../_components/FeatureTree';
import { EpicTree } from '../_components/EpicTree';
import { EstimateMatrix } from '../_components/EstimatesSubForm';


const client = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

const schemaJson = `
  epics: {
    name: string
    context: string
    features: {
      name: string
      context: string
      tasks: {
        name: string
        context: string
      }[]
    }[]
}[]
`

const prompt: any = [
  {"role": "system", "content": `This is a message from a document with feature requirements for a future IT project. Extract information about project epics features and tasks according this JSON schema - ${schemaJson}. Keep context fields maximum in range of 50-100 tokens
  `},
  {"role": "user", "content": docText }
]
const supabaseUrl = 'https://vilmdronupdhikexxmct.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey ?? '')

const getResponse = () => {
  client.chat.completions.create({
    model: 'gpt-4o-mini-2024-07-18',
    messages: prompt,
    response_format: {"type": "json_object"}
  })
  .asResponse()
    .then(response => response.json())
    .then(json => {
      const content = json.choices.at(0)?.message.content
      const parsed = content ? JSON.parse(content) : {}
      console.log('parsed', parsed);
      
      // return supabase.from('mock_data').insert({
      //   description: 'features_ml',
      //   proto_json: parsed
      // })
    })
}
const rankingPrompt = (message: string, context: string): any => [
  {"role": "system", "content": ``},
  {"role": "user", "content": '' }
]
const ranking = {
  epics: 5,
  features: 2,
  tasks: 1,
}
const calculateTotal = (original: Epic[], toRate: Epic[]) => {
  const totalEpicPoints = original.length * ranking.epics
  const totalFeaturePoints = original.flatMap(({ features }) => features).length * ranking.features
  const totalTasksPoints = original.flatMap(({ features }) => features).flatMap(({ tasks }) => tasks).length * ranking.tasks

  const totalPoints = totalEpicPoints + totalFeaturePoints + totalTasksPoints

  const originalEpics = original.map(({ name }) => name)
  const originalFeatures = original.flatMap(({ features }) => features).map(({ name }) => name)
  const originalTasks = original.flatMap(({ features }) => features).flatMap(({ tasks }) => tasks).map(({ name }) => name)
  const toRateEpicsContext = toRate.map(({ name }) => name).join(';\n')
  const toRateFeaturesContext = toRate.flatMap(({ features }) => features).map(({ name }) => name).join(';\n')
  const toRateTasksContext = toRate.flatMap(({ features }) => features).flatMap(({ tasks }) => tasks).map(({ name }) => name).join(';\n')
  
}
export default function Projects() {
  const methods = useForm<{epics: Epic[], name: string, estimate_matrix: EstimateColumn[] }>()

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <Button onClick={methods.handleSubmit(async data => {
        await supabase.from('fr_projects').insert(data)
      })}>Create Form</Button>
      <FormProvider {...methods}>
        <EstimateMatrix />
        <Controller name="name" render={({ field }) => <TextField label="Название проекта" {...field} />} />
        <EpicTree />
      </FormProvider>
    </main>
  );
}
