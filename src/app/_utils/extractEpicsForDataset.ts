import { Epic } from "~/types";
import { supabase } from "./db";
import { castDbJsonToType } from "./castDbJsonToType";
import { Database } from "~/server/db/database.types";
import { promptEpicsStep } from "./stepFeaturizePrompts";
import { saveAs } from "file-saver";

const extractEpicsForDataset = async (epics: Epic[], original_input: string) => {
  await supabase.from('fr_extract_epics_dataset').insert({
    epics: epics.map(({ name }) => name),
    original_input,
  });
}

export const extractTasksFromDbProject = async (id: number) => {
  const { data } = await supabase.from('fr_projects').select().eq('id', id).limit(1).single()
  if (data?.epics) {
    await extractEpicsForDataset(castDbJsonToType<Epic[]>(data.epics), data.original_input ?? '')
  }
}

const datasetJsonl = ({ epics, original_input }: Database['public']['Tables']['fr_extract_epics_dataset']['Row']) => {
  const object = {
    epics: epics?.map((epic) => ({ name: epic })) ?? []
  }
  
  return JSON.stringify({
    messages: [...promptEpicsStep(original_input), {"role": "assistant", "content": JSON.stringify(object)}]
  }) 
}

export const datasetTasks = async () => {
  await supabase.from('fr_extract_epics_dataset').select().then(({ data }) => {
    if (data) {
      const file = new File([data.map(datasetJsonl).join('\n')], "datasetTasks.jsonl", {
        type: "text/plain",
      })
      saveAs(file, `datasetTasks.jsonl`);
    }
  })
}