import { Epic } from "~/types"
import { getRankingResponse } from "./compareProjects"

const ranking = {
  epics: 5,
  features: 2,
  tasks: 1,
}
export const calculateTotal = async (original: Epic[], toRate: Epic[]) => {
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
  const resEpics = await Promise.allSettled(originalEpics.map(epic => getRankingResponse(epic, toRateEpicsContext)))
  const epicPoints = resEpics
    .map((res) => res.status === 'fulfilled' && res.value.score ? res.value.score / 100 : 0)
    .reduce((acc, score) => acc + score, 0) * ranking.epics
  let resFeatures: any[] = []
  for(let i = 0; i < originalFeatures.length / 5; i++) {
    const slice = originalFeatures.slice(i * 5, (i+1) * 5)
    const sliceFeatures = await Promise.allSettled(slice.map(feature => getRankingResponse(feature, toRateFeaturesContext)))
    resFeatures = resFeatures.concat(sliceFeatures)
  }
  const featurePoints = resFeatures
    .map((res) => res.status === 'fulfilled' && res.value.score ? res.value.score / 100 : 0)
    .reduce((acc, score) => acc + score, 0)  * ranking.features

  let resTasks: any[] = []
  for(let i = 0; i < originalTasks.length / 5; i++) {
    const slice = originalTasks.slice(i * 5, (i+1) * 5)
    const sliceTasks = await Promise.allSettled(slice.map(task => getRankingResponse(task, toRateTasksContext)))
    resTasks = resTasks.concat(sliceTasks)
  }
  const taskPoints = resTasks
    .map((res) => res.status === 'fulfilled' && res.value.score ? res.value.score / 100 : 0)
    .reduce((acc, score) => acc + score, 0)  * ranking.tasks

  console.log('epicPoints', epicPoints, 'featurePoints', featurePoints, 'taskPoints', taskPoints);
  const totalEarnedPoints = epicPoints + featurePoints + taskPoints
  const finalPercent = totalEarnedPoints / totalPoints
  return { finalPercent }
  
}