export interface Epic {
  id: number
  name: string
  features: Feature[]
  context: string
}
export interface Feature {
  id: number
  name: string
  tasks: Task[]
  context: string
}
export interface Task {
  id: number
  name: string
  context: string
  estimates: Estimate[]
}
interface EstimateColumnRegular {
  id: number
  type: 'regular'
  name: string
}
interface EstimateColumnMultiplier {
  id: number
  type: 'multiplier'
  name: string
  multiplier: number
  referenceColumnId: number
}
export type EstimateColumn = EstimateColumnRegular | EstimateColumnMultiplier
interface Estimate {
  taskId: Task['id']
  columnId: EstimateColumn['id']
  estimateInHours: number
}