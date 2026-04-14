import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkWebhookTraces() {
  console.log('Checking Webhook Traces...');
  
  // Check notifications
  const { data: notifications, error: notifError } = await supabase
    .from('notifications')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);

  if (notifError) console.error('Error fetching notifications:', notifError);
  else {
    console.log('\nLatest Notifications:');
    console.table(notifications);
  }

  // Check subscriptions (orders)
  const { data: orders, error: orderError } = await supabase
    .from('subscriptions')
    .select('*')
    .order('current_period_end', { ascending: false })
    .limit(5);

  if (orderError) console.error('Error fetching orders:', orderError);
  else {
    console.log('\nLatest Orders in subscriptions table:');
    console.table(orders);
  }
}

checkWebhookTraces();
