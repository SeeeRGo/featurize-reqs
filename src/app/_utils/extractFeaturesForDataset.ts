import { createClient } from "@supabase/supabase-js";
import { Epic } from "~/types";
import { saveAs } from "file-saver";
import { promptFeaturesStep } from "./stepFeaturizePrompts";
import { castDbJsonToType } from "./castDbJsonToType";
import { Database } from "~/server/db/database.types";
import { supabase } from "./db";

const extractFeaturesForDataset = async (epics: Epic[]) => {
  await Promise.allSettled(epics.map(epic => {
    const features = epic.features.map(({ name, context }) => ({ name, context }))
    
    return supabase.from('fr_extract_features_dataset').insert({
      epic_name_input: epic.name,
      epic_context_input: epic.context,
      features_json_result: features
    });
  }))
}

export const extractFeaturesFromDbProject = async (id: number) => {
  const { data } = await supabase.from('fr_projects').select().eq('id', id).limit(1).single()
  if (data?.epics) {
    await extractFeaturesForDataset(castDbJsonToType<Epic[]>(data.epics))
  }
}

const datasetJsonl = ({ epic_context_input, epic_name_input, features_json_result }: Database['public']['Tables']['fr_extract_features_dataset']['Row']) => {
  const object = {
    features: features_json_result
  }
  return JSON.stringify({
    messages: [...promptFeaturesStep({ name: epic_name_input, context: epic_context_input }), {"role": "assistant", "content": JSON.stringify(object)}]
  }) 
}

export const datasetFeatures = async () => {
  await supabase.from('fr_extract_features_dataset').select().then(({ data }) => {
    if (data) {
      const file = new File([data.map(datasetJsonl).join('\n')], "datasetFeatures.jsonl", {
        type: "text/plain",
      })
      saveAs(file, `datasetFeatures.jsonl`);
    }
  })
}