const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkPrices() {
  const { data, error } = await supabase.from('products').select('name, price, stripe_price_id');
  if (error) {
    console.error('Error fetching products:', error);
    return;
  }
  console.log('Products in DB:');
  data.forEach(p => {
    console.log(`- ${p.name}: Price=${p.price}, StripeID=${p.stripe_price_id}`);
  });
}

checkPrices();
