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
export default function Home() {
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
