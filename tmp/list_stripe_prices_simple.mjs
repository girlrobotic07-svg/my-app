import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
});

async function findPrices() {
  try {
    const products = await stripe.products.list({ limit: 10 });
    console.log('--- Stripe Products and Prices ---');
    for (const product of products.data) {
      const prices = await stripe.prices.list({ product: product.id, active: true });
      console.log(`Product: ${product.name} (${product.id})`);
      prices.data.forEach(price => {
        console.log(`  - Price ID: ${price.id} (${(price.unit_amount / 100).toFixed(2)} ${price.currency.toUpperCase()})`);
      });
    }
  } catch (error) {
    console.error('Error fetching from Stripe:', error);
  }
}

findPrices();
