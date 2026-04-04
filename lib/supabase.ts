// import { createClient } from '@supabase/supabase-js'

// export const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
// )
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

// TypeScript type for a product row
export type Product = {
  id: string
  name: string
  description: string | null
  price: number
  created_at: string
}

export type Profile = {
  id: string
  full_name: string | null
  avatar_url: string | null
  updated_at: string
}