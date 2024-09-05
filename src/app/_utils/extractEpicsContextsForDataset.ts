import { Epic } from "~/types";
import { supabase } from "./db";
import { castDbJsonToType } from "./castDbJsonToType";
import { Database } from "~/server/db/database.types";
import { promptEpicsContextsStep } from "./stepFeaturizePrompts";
import { saveAs } from "file-saver";

const extractEpicsContextForDataset = async (epics: Epic[], originalInput: string) => {
  await Promise.allSettled(epics.map(epic => {
    
    return supabase.from('fr_extract_epic_context_dataset').insert({
      original_text_input: originalInput,
      epic_context_result: epic.context,
      epic_name_input: epic.name
    });
  }))
}

export const extractEpicsContextsFromDbProject = async (id: number) => {
  const { data } = await supabase.from('fr_projects').select().eq('id', id).limit(1).single()
  if (data?.epics) {
    await extractEpicsContextForDataset(castDbJsonToType<Epic[]>(data.epics), data.original_input ?? '')
  }
}

const datasetJsonl = ({ original_text_input, epic_context_result, epic_name_input }: Database['public']['Tables']['fr_extract_epic_context_dataset']['Row']) => {  
  return JSON.stringify({
    messages: [...promptEpicsContextsStep(original_text_input)(epic_name_input), {"role": "assistant", "content": epic_context_result}]
  }) 
}

export const datasetEpicsContexts = async () => {
  await supabase.from('fr_extract_epic_context_dataset').select().then(({ data }) => {
    if (data) {
      const file = new File([data.map(datasetJsonl).join('\n')], "datasetEpicContexts.jsonl", {
        type: "text/plain",
      })
      saveAs(file, `datasetEpicContexts.jsonl`);
    }
  })
}