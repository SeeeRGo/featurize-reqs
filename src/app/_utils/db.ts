import { createClient } from "@supabase/supabase-js"
import { Database } from "~/server/db/database.types"

const supabaseUrl = 'https://vilmdronupdhikexxmct.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
export const supabase = createClient<Database>(supabaseUrl, supabaseKey ?? '')
