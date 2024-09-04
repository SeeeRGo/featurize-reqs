import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js'
import { docText } from '~/constants';

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

export const getResponse = () => {
  const supabaseUrl = 'https://vilmdronupdhikexxmct.supabase.co'
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const supabase = createClient(supabaseUrl, supabaseKey ?? '')
  client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: prompt,
    response_format: {"type": "json_object"}
  })
  .asResponse()
    .then(response => response.json())
    .then(json => {
      const content = json.choices.at(0)?.message.content
      const parsed = content ? JSON.parse(content) : {}
      console.log('parsed', parsed);
      
      return supabase.from('mock_data').insert({
        description: 'features_ml_steps',
        proto_json: parsed
      })
    })
}