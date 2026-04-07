import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

async function checkProducts() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data, error, count } = await supabase
    .from('products')
    .select('*', { count: 'exact' })
  
  if (error) console.error(error)
  else console.log(`Total products in DB: ${count}`)
}

checkProducts()
