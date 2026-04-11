import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function sync() {
  const { data: products, error } = await supabase.from('products').select('*');
  if (error) {
    console.error('Supabase fetch error:', error);
    return;
  }

  console.log(`Checking ${products.length} products...`);

  for (const product of products) {
    /*
    if (product.stripe_price_id && product.stripe_price_id.startsWith('price_')) {
      console.log(`- ${product.name} already has a valid price ID: ${product.stripe_price_id}`);
      continue;
    }
    */

    console.log(`- Creating Stripe price for: ${product.name} (${product.price} cents)`);

    try {
      // 1. Create Product
      const stripeProduct = await stripe.products.create({
        name: product.name,
        description: product.description || undefined,
      });

      // 2. Create Price
      const stripePrice = await stripe.prices.create({
        product: stripeProduct.id,
        unit_amount: product.price * 100, // Convert Rupees to Paise
        currency: 'inr',
      });

      // 3. Update Supabase
      const { error: updateError } = await supabase
        .from('products')
        .update({ stripe_price_id: stripePrice.id })
        .eq('id', product.id);

      if (updateError) {
        console.error(`  Error updating Supabase for ${product.name}:`, updateError);
      } else {
        console.log(`  Successfully synced! New Price ID: ${stripePrice.id}`);
      }
    } catch (err) {
      console.error(`  Stripe error for ${product.name}:`, err.message);
    }
  }
}

sync();
