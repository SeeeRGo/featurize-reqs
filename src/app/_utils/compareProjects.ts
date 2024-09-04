import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

const rankingPrompt = (message: string, context: string): any => [
  {"role": "system", "content": `Given the context and the sentence(s) to search for, determine the "inclusion score" for context and sentence(s). Score is between 0 and 100. 100 is perfect score when the sentence(s) or its paraphrase is found in a context. 0 is the score when nothing in the context is even remotely related to the meaning of the sentence(s). Answer according to this JSON schema - { score: number }`},
  {"role": "user", "content": `Sentence(s) - ${message}\n Context - ${context}` }
]
export const getRankingResponse = (message: string, context: string) => {
  return client.chat.completions.create({
    model: 'gpt-4o-mini-2024-07-18',
    messages: rankingPrompt(message, context),
    response_format: {"type": "json_object"}
  })
  .asResponse()
    .then(response => response.json())
    .then(json => {
      const content = json.choices.at(0)?.message.content
      const parsed = content ? JSON.parse(content) : {}
      console.log('parsed', parsed);
      return parsed
      // return supabase.from('mock_data').insert({
      //   description: 'features_ml',
      //   proto_json: parsed
      // })
    })
}