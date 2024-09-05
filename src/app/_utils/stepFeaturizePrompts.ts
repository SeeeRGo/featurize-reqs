import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js'
import { docText } from '~/constants';
import { Epic } from '~/types';
import { supabase } from './db';

const client = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

const schemaEpicsJson = `
  epics: {
    name: string
}[]
`

const model = 'gpt-4o'
const promptEpicsStep: any = [
  {"role": "system", "content": `This is a message from a document with feature requirements for a future IT project. Extract information about project according to this JSON schema - ${schemaEpicsJson}. Epics are most important top-level pieces of the project, like individual pages and core backend services and integrations.
  `},
  {"role": "user", "content": docText }
]

const getEpicsResponse = () => {
  return client.chat.completions.create({
    model,
    messages: promptEpicsStep,
    response_format: {"type": "json_object"}
  })
  .asResponse()
    .then(response => response.json())
    .then(json => {
      const content = json.choices.at(0)?.message.content
      const parsed = content ? JSON.parse(content) : {}
      console.log('parsed', parsed);
      return parsed
    })
}

const promptEpicsContextsStep: any = (epicName: string) => [
  {"role": "system", "content": `This is a message from a document with feature requirements for a future IT project. Extract all information about epic "${epicName}". Include everything that has above 30% chance to be relevant to the epic
  `},
  {"role": "user", "content": docText }
]

const getEpicsContextsResponse = async (epics: string[]) => {
  const results = []
  for (let i = 0; i < epics.length; i++) {
    const epic = epics[i]
    const res = await client.chat.completions.create({
      model,
      messages: promptEpicsContextsStep(epic),
      response_format: {"type": "text"}
    })
    .asResponse()
      .then(response => response.json())
      .then(json => {
        const content = json.choices.at(0)?.message.content ?? ''
        console.log('parsed', content);

        return {
          name: epic ?? '',
          context: content
        }
      })
      results.push(res)
  }

  return results
}


const featuresSchemaJson = `{
    features: {
    name: string,
    context: string
  }[]
}
`
export const promptFeaturesStep: any = (epic: Pick<Epic, 'context' | 'name'>) => [
  {"role": "system", "content": `Given a message with context about an epic "${epic.name}" from future IT project, extract features for given epic - logically distinct groups of tasks. Extract information according to JSON schema - ${featuresSchemaJson}
  `},
  {"role": "user", "content": epic.context }
]
const getFeaturesStepResponse = (epic: Pick<Epic, 'context' | 'name'>) => {
  return client.chat.completions.create({
    model,
    messages: promptFeaturesStep(epic),
    response_format: {"type": "json_object"}
  })
  .asResponse()
    .then(response => response.json())
    .then(json => {
      const content = json.choices.at(0)?.message.content
      const parsed = content ? JSON.parse(content) : {}
      console.log('parsed', parsed);
      return {
        ...epic,
        ...parsed
      }
    })
}
const tasksSchemaJson = `{
  tasks: {
  name: string,
  context: string
}[]
}
`
export const promptTaskStep: any = ({ epicContext, featureName }:{epicContext: string, featureName: string}) => [
  {"role": "system", "content": `Given a message with context about a feature "${featureName}" from future IT project, extract individual tasks for given feature. Extract information according to JSON schema - ${tasksSchemaJson}
  `},
  {"role": "user", "content": epicContext }
]
const getTasksStepResponse = async (epics: Array<Pick<Epic, 'context' | 'name' | 'features'>>) => {
  
  const results = []
  for (let i = 0; i < epics.length; i++) {
    const epic = epics[i]
    const res = await Promise.allSettled((epic?.features ?? []).map(async feature => {
      const featuresWithTasks = await client.chat.completions.create({
        model,
        messages: promptTaskStep({epicContext: epic?.context ?? '', featureName: feature.name}),
        response_format: {"type": "json_object"}
      })
      .asResponse()
        .then(response => response.json())
        .then(json => {
          const content = json.choices.at(0)?.message.content ?? ''
          const parsed = content ? JSON.parse(content) : {}
          console.log('parsed', content);
  
          return {
            ...feature,
            ...parsed,
          }
        })
        return featuresWithTasks
    }))
    const fullEpic = {
      ...epic,
      features: res.map(result => 'value' in result ? result.value : undefined).filter(res => !!res)
    }

      results.push(fullEpic)
  }

  return results
}
export const getEpicsWithContextsStepResponse = async () => {
  const { epics } = await getEpicsResponse()
  const epicsWithContexts = await getEpicsContextsResponse(epics.map(({ name }: any) => name))
  const epicsWithFeatures = await Promise.allSettled(epicsWithContexts.map(getFeaturesStepResponse))
  const parsedEpicsWithFeatures = epicsWithFeatures.map(result => 'value' in result ? result.value : undefined).filter(res => !!res)
  
  const fullEpics = await getTasksStepResponse(parsedEpicsWithFeatures)
  console.log('full epics', fullEpics);
  
  await writeToDb('features_ml_step_full_4o', fullEpics)
  return fullEpics
}
const writeToDb = async (description: string, proto_json: any) => {
  await supabase.from('mock_data').insert({
    description,
    proto_json
  })
}