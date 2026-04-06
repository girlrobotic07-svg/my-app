'use server'

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function upsertCategory(formData: FormData) {
  const id = formData.get('id') as string | null
  const name = formData.get('name') as string
  const slug = formData.get('slug') as string
  const description = formData.get('description') as string
  const image_url = formData.get('image_url') as string

  const data = { name, slug, description, image_url }

  if (id) {
    const { error } = await supabaseAdmin
      .from('categories')
      .update(data)
      .eq('id', id)
    if (error) throw new Error(error.message)
  } else {
    const { error } = await supabaseAdmin
      .from('categories')
      .insert(data)
    if (error) throw new Error(error.message)
  }

  revalidatePath('/admin/categories')
  return { success: true }
}

export async function deleteCategory(id: string) {
  const { error } = await supabaseAdmin
    .from('categories')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath('/admin/categories')
  return { success: true }
}
