import { Json } from "~/server/db/database.types"

export function castDbJsonToType<T>(value: Json) {
  return value as T
}