import { Epic, Feature } from "~/types";
import { supabase } from "./db";
import { castDbJsonToType } from "./castDbJsonToType";
import { saveAs } from "file-saver";
import { promptTaskStep } from "./stepFeaturizePrompts";
import { Database } from "~/server/db/database.types";

const extractTasksForDataset = async (features: Feature[]) => {
  await Promise.allSettled(features.map(feature => {
    const tasks = feature.tasks.map(({ name, context }) => ({ name, context }))
    
    return supabase.from('fr_extract_tasks_dataset').insert({
      feature_name_input: feature.name,
      epic_context_input: feature.context,
      tasks_json_result: tasks
    });
  }))
}

export const extractTasksFromDbProject = async (id: number) => {
  const { data } = await supabase.from('fr_projects').select().eq('id', id).limit(1).single()
  if (data?.epics) {
    await extractTasksForDataset(castDbJsonToType<Epic[]>(data.epics).flatMap(({ features, context }) => features.map(feature => ({
      ...feature,
      context
    }))))
  }
}

const datasetJsonl = ({ epic_context_input, feature_name_input, tasks_json_result }: Database['public']['Tables']['fr_extract_tasks_dataset']['Row']) => {
  const object = {
    tasks: tasks_json_result
  }
  
  return JSON.stringify({
    messages: [...promptTaskStep({ epicContext: epic_context_input, featureName: feature_name_input }), {"role": "assistant", "content": JSON.stringify(object)}]
  }) 
}

export const datasetTasks = async () => {
  await supabase.from('fr_extract_tasks_dataset').select().then(({ data }) => {
    if (data) {
      const file = new File([data.map(datasetJsonl).join('\n')], "datasetTasks.jsonl", {
        type: "text/plain",
      })
      saveAs(file, `datasetTasks.jsonl`);
    }
  })
}