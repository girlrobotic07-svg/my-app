'use server'

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function upsertProduct(formData: FormData) {
  const id = formData.get('id') as string | null
  const name = formData.get('name') as string
  const slug = formData.get('slug') as string
  const description = formData.get('description') as string
  const price = parseInt(formData.get('price') as string) // stored in cents
  const stock_quantity = parseInt(formData.get('stock_quantity') as string)
  const category_id = formData.get('category_id') as string
  const stripe_price_id = formData.get('stripe_price_id') as string
  const status = formData.get('status') as string
  const is_featured = formData.get('is_featured') === 'on'
  
  // Handling arrays for sizes and colors
  const sizes = (formData.get('sizes') as string).split(',').map(s => s.trim()).filter(Boolean)
  const colors = (formData.get('colors') as string).split(',').map(c => c.trim()).filter(Boolean)

  const data = {
    name,
    slug,
    description,
    price,
    stock_quantity,
    category_id: category_id || null,
    stripe_price_id,
    status,
    is_featured,
    sizes,
    colors
  }

  if (id) {
    const { error } = await supabaseAdmin
      .from('products')
      .update(data)
      .eq('id', id)
    if (error) throw new Error(error.message)
  } else {
    const { error } = await supabaseAdmin
      .from('products')
      .insert(data)
    if (error) throw new Error(error.message)
  }

  revalidatePath('/admin/products')
  revalidatePath('/products') // Also revalidate the public products page
  return { success: true }
}

export async function deleteProduct(id: string) {
  const { error } = await supabaseAdmin
    .from('products')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath('/admin/products')
  revalidatePath('/products')
  return { success: true }
}
