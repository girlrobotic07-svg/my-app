import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const updates = [
  { name: 'Starter Plan', stripe_price_id: 'price_1THPpiC0EQvR7vwNWEZh1bjD' },
  { name: 'Pro Plan', stripe_price_id: 'price_1THPqCC0EQvR7vwNHq6gFBnt' },
  { name: 'Enterprise Plan', stripe_price_id: 'price_1THPqdC0EQvR7vwNQi7wa60v' }
];

async function updateProducts() {
  console.log('--- Updating Supabase Products ---');
  for (const update of updates) {
    const { data, error } = await supabase
      .from('products')
      .update({ stripe_price_id: update.stripe_price_id })
      .eq('name', update.name)
      .select();
    
    if (error) {
      console.error(`Error updating ${update.name}:`, error);
    } else if (data.length === 0) {
      console.warn(`No product found with name: ${update.name}`);
    } else {
      console.log(`Updated ${update.name} with Price ID: ${update.stripe_price_id}`);
    }
  }
}

updateProducts();
