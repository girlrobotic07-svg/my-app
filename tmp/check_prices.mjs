import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkProducts() {
  const { data: products, error } = await supabase.from('products').select('id, name, price, stripe_price_id');
  if (error) {
    console.error('Error fetching products:', error);
    return;
  }

  console.log('Current Products in Database:');
  console.table(products);

  const invalidProducts = products.filter(p => p.stripe_price_id && !p.stripe_price_id.startsWith('price_'));
  if (invalidProducts.length > 0) {
    console.log('\nProducts with invalid stripe_price_id:');
    console.table(invalidProducts);
  } else {
    console.log('\nAll products have valid (or empty) stripe_price_id.');
  }
}

checkProducts();
