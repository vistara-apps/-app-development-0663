# Stripe Integration Documentation

This document provides detailed information about the Stripe integration in the MemeMaster AI application.

## Overview

MemeMaster AI uses Stripe for payment processing and subscription management. This integration enables users to subscribe to different tiers of the service, manage their subscriptions, and process payments securely.

## Integration Components

1. **Subscription Management**: Create and manage subscription plans.
2. **Payment Processing**: Securely process payments for subscriptions.
3. **Customer Portal**: Allow users to manage their billing information and subscriptions.
4. **Webhook Handling**: Process Stripe events for subscription updates.

## Implementation Details

The `src/services/stripe.js` file provides functions for interacting with the Stripe API:

### Configuration

```javascript
// Initialize Stripe
const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
let stripePromise = null;

export const getStripe = async () => {
  if (!stripePromise) {
    stripePromise = import('https://js.stripe.com/v3/').then(Stripe => {
      return Stripe.default(STRIPE_PUBLIC_KEY);
    });
  }
  return stripePromise;
};
```

### Checkout Session Creation

The `createCheckoutSession` function creates a Stripe checkout session for subscription:

```javascript
export const createCheckoutSession = async (priceId, userId, userEmail) => {
  try {
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId,
        userId,
        userEmail,
      }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create checkout session');
    }
    
    const session = await response.json();
    return session.id;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};
```

### Redirect to Checkout

The `redirectToCheckout` function redirects the user to the Stripe checkout page:

```javascript
export const redirectToCheckout = async (sessionId) => {
  try {
    const stripe = await getStripe();
    const { error } = await stripe.redirectToCheckout({ sessionId });
    
    if (error) {
      throw new Error(error.message);
    }
  } catch (error) {
    console.error('Error redirecting to checkout:', error);
    throw error;
  }
};
```

### Customer Portal

The `getCustomerPortalUrl` function gets the URL for the Stripe customer portal:

```javascript
export const getCustomerPortalUrl = async (userId) => {
  try {
    const response = await fetch('/api/create-customer-portal-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
      }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create customer portal session');
    }
    
    const session = await response.json();
    return session.url;
  } catch (error) {
    console.error('Error getting customer portal URL:', error);
    throw error;
  }
};
```

### Subscription Plans

The `getSubscriptionPlans` function gets the available subscription plans:

```javascript
export const getSubscriptionPlans = async () => {
  try {
    const response = await fetch('/api/subscription-plans');
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get subscription plans');
    }
    
    const plans = await response.json();
    return plans;
  } catch (error) {
    console.error('Error getting subscription plans:', error);
    throw error;
  }
};
```

For development purposes, a mock function is provided:

```javascript
export const getMockSubscriptionPlans = () => {
  return [
    {
      id: 'free',
      name: 'Free',
      description: 'Basic meme generation with limited features',
      price: 0,
      priceId: 'price_free',
      features: [
        '3 meme generations per day',
        'Basic humor styles',
        'Standard meme templates',
      ],
      isPopular: false,
    },
    {
      id: 'pro',
      name: 'Pro',
      description: 'Advanced meme creation with more generations',
      price: 10,
      priceId: 'price_pro',
      features: [
        '50 meme generations per day',
        'All humor styles',
        'Advanced tuning options',
        'Trend analytics',
      ],
      isPopular: true,
    },
    {
      id: 'viral',
      name: 'Viral',
      description: 'Unlimited meme generation with all premium features',
      price: 25,
      priceId: 'price_viral',
      features: [
        'Unlimited meme generations',
        'All Pro features',
        'Engagement predictor',
        'Priority support',
        'Custom meme templates',
      ],
      isPopular: false,
    },
  ];
};
```

## Backend API Endpoints

The following API endpoints are required for the Stripe integration:

### Create Checkout Session

```javascript
// api/create-checkout-session.js
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { priceId, userId, userEmail } = req.body;

    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      billing_address_collection: 'auto',
      customer_email: userEmail,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.DOMAIN}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.DOMAIN}/subscription/cancel`,
      metadata: {
        userId,
      },
    });

    return res.status(200).json({ id: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return res.status(500).json({ error: error.message });
  }
}
```

### Create Customer Portal Session

```javascript
// api/create-customer-portal-session.js
import Stripe from 'stripe';
import { supabase } from '../../utils/supabase-admin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId } = req.body;

    // Get the user's subscription from the database
    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', userId)
      .single();

    if (error || !subscription?.stripe_customer_id) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    // Create a customer portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: subscription.stripe_customer_id,
      return_url: `${process.env.DOMAIN}/account`,
    });

    return res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Error creating customer portal session:', error);
    return res.status(500).json({ error: error.message });
  }
}
```

### Get Subscription Plans

```javascript
// api/subscription-plans.js
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get all products
    const products = await stripe.products.list({
      active: true,
      expand: ['data.default_price'],
    });

    // Format the products into subscription plans
    const plans = products.data.map((product) => {
      const price = product.default_price;
      return {
        id: product.id,
        name: product.name,
        description: product.description,
        price: price.unit_amount / 100, // Convert from cents to dollars
        priceId: price.id,
        features: product.features || [],
        isPopular: product.metadata.popular === 'true',
      };
    });

    return res.status(200).json({ plans });
  } catch (error) {
    console.error('Error getting subscription plans:', error);
    return res.status(500).json({ error: error.message });
  }
}
```

### Webhook Handler

```javascript
// api/webhooks/stripe.js
import Stripe from 'stripe';
import { buffer } from 'micro';
import { supabase } from '../../../utils/supabase-admin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (error) {
    console.error(`Webhook Error: ${error.message}`);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutSessionCompleted(event.data.object);
      break;
    case 'customer.subscription.updated':
      await handleSubscriptionUpdated(event.data.object);
      break;
    case 'customer.subscription.deleted':
      await handleSubscriptionDeleted(event.data.object);
      break;
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return res.status(200).json({ received: true });
}

async function handleCheckoutSessionCompleted(session) {
  // Get the subscription
  const subscription = await stripe.subscriptions.retrieve(session.subscription);

  // Get the customer
  const customer = await stripe.customers.retrieve(session.customer);

  // Get the price
  const price = await stripe.prices.retrieve(subscription.items.data[0].price.id);

  // Get the product
  const product = await stripe.products.retrieve(price.product);

  // Get the user ID from the session metadata
  const userId = session.metadata.userId;

  // Determine the subscription tier based on the product
  let tier;
  if (product.name.toLowerCase().includes('pro')) {
    tier = 'pro';
  } else if (product.name.toLowerCase().includes('viral')) {
    tier = 'viral';
  } else {
    tier = 'free';
  }

  // Update the user's subscription in the database
  const { error } = await supabase
    .from('subscriptions')
    .upsert({
      user_id: userId,
      tier,
      stripe_customer_id: customer.id,
      stripe_subscription_id: subscription.id,
      status: subscription.status,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end,
    });

  if (error) {
    console.error('Error updating subscription:', error);
  }

  // Update the user's usage limits based on the subscription tier
  let dailyGenerations;
  if (tier === 'viral') {
    dailyGenerations = 1000; // Effectively unlimited
  } else if (tier === 'pro') {
    dailyGenerations = 50;
  } else {
    dailyGenerations = 3;
  }

  const { error: usageLimitsError } = await supabase
    .from('usage_limits')
    .upsert({
      user_id: userId,
      daily_generations: dailyGenerations,
    });

  if (usageLimitsError) {
    console.error('Error updating usage limits:', usageLimitsError);
  }
}

async function handleSubscriptionUpdated(subscription) {
  // Get the customer
  const customer = await stripe.customers.retrieve(subscription.customer);

  // Get the price
  const price = await stripe.prices.retrieve(subscription.items.data[0].price.id);

  // Get the product
  const product = await stripe.products.retrieve(price.product);

  // Determine the subscription tier based on the product
  let tier;
  if (product.name.toLowerCase().includes('pro')) {
    tier = 'pro';
  } else if (product.name.toLowerCase().includes('viral')) {
    tier = 'viral';
  } else {
    tier = 'free';
  }

  // Get the user ID from the database
  const { data: userData, error: userError } = await supabase
    .from('subscriptions')
    .select('user_id')
    .eq('stripe_subscription_id', subscription.id)
    .single();

  if (userError) {
    console.error('Error getting user ID:', userError);
    return;
  }

  const userId = userData.user_id;

  // Update the user's subscription in the database
  const { error } = await supabase
    .from('subscriptions')
    .upsert({
      user_id: userId,
      tier,
      stripe_customer_id: customer.id,
      stripe_subscription_id: subscription.id,
      status: subscription.status,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end,
    });

  if (error) {
    console.error('Error updating subscription:', error);
  }

  // Update the user's usage limits based on the subscription tier
  let dailyGenerations;
  if (tier === 'viral') {
    dailyGenerations = 1000; // Effectively unlimited
  } else if (tier === 'pro') {
    dailyGenerations = 50;
  } else {
    dailyGenerations = 3;
  }

  const { error: usageLimitsError } = await supabase
    .from('usage_limits')
    .upsert({
      user_id: userId,
      daily_generations: dailyGenerations,
    });

  if (usageLimitsError) {
    console.error('Error updating usage limits:', usageLimitsError);
  }
}

async function handleSubscriptionDeleted(subscription) {
  // Get the user ID from the database
  const { data: userData, error: userError } = await supabase
    .from('subscriptions')
    .select('user_id')
    .eq('stripe_subscription_id', subscription.id)
    .single();

  if (userError) {
    console.error('Error getting user ID:', userError);
    return;
  }

  const userId = userData.user_id;

  // Update the user's subscription in the database
  const { error } = await supabase
    .from('subscriptions')
    .upsert({
      user_id: userId,
      tier: 'free',
      status: 'canceled',
      cancel_at_period_end: false,
    });

  if (error) {
    console.error('Error updating subscription:', error);
  }

  // Update the user's usage limits to free tier
  const { error: usageLimitsError } = await supabase
    .from('usage_limits')
    .upsert({
      user_id: userId,
      daily_generations: 3,
    });

  if (usageLimitsError) {
    console.error('Error updating usage limits:', usageLimitsError);
  }
}
```

## Subscription Component

The `src/components/subscription/PlanSelector.jsx` component provides a user interface for selecting and subscribing to plans:

```jsx
const PlanSelector = () => {
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { user, subscription, hasSubscription } = useAuth();
  
  // Load subscription plans
  useEffect(() => {
    // In a real app, we would fetch plans from the API
    // For now, we'll use mock data
    const subscriptionPlans = getMockSubscriptionPlans();
    setPlans(subscriptionPlans);
    
    // Set the current plan as selected if the user has a subscription
    if (subscription) {
      const currentPlan = subscriptionPlans.find(plan => plan.id === subscription.tier);
      if (currentPlan) {
        setSelectedPlan(currentPlan.id);
      }
    }
  }, [subscription]);
  
  const handleSelectPlan = (planId) => {
    setSelectedPlan(planId);
  };
  
  const handleSubscribe = async () => {
    if (!selectedPlan) return;
    
    // Don't resubscribe to the same plan
    if (subscription && subscription.tier === selectedPlan) {
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      // In a real app, we would create a checkout session and redirect to Stripe
      // For now, we'll just simulate the process
      
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success message
      alert(`Successfully subscribed to ${selectedPlan} plan!`);
      
      // In a real app, we would update the user's subscription in the database
      // and redirect to the Stripe checkout page
      
    } catch (err) {
      console.error('Subscription error:', err);
      setError(err.message || 'Failed to process subscription. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Render subscription plans
  // ...
};
```

## Security Considerations

1. **API Key Management**: Stripe API keys are stored in environment variables and never exposed to the client.
2. **PCI Compliance**: Use Stripe Elements or Checkout to handle payment information securely.
3. **Webhook Signatures**: Verify webhook signatures to prevent unauthorized requests.
4. **HTTPS**: Ensure all communication with Stripe is over HTTPS.

## Production Considerations

For a production deployment, consider the following enhancements:

1. **Test Mode vs. Live Mode**: Use Stripe's test mode for development and testing.
2. **Webhook Reliability**: Implement webhook retry logic and idempotency.
3. **Error Handling**: Implement comprehensive error handling for payment failures.
4. **Subscription Management**: Provide a user interface for managing subscriptions.
5. **Invoicing**: Implement invoice generation and delivery.

## Usage Examples

### Creating a Checkout Session

```javascript
import { createCheckoutSession, redirectToCheckout } from '../services/stripe';

// Create a checkout session and redirect to Stripe
const handleSubscribe = async (priceId) => {
  try {
    const sessionId = await createCheckoutSession(priceId, user.id, user.email);
    await redirectToCheckout(sessionId);
  } catch (error) {
    console.error('Error subscribing:', error);
  }
};
```

### Getting Subscription Plans

```javascript
import { getSubscriptionPlans } from '../services/stripe';

// Get subscription plans
const loadPlans = async () => {
  try {
    const plans = await getSubscriptionPlans();
    setPlans(plans);
  } catch (error) {
    console.error('Error loading plans:', error);
  }
};
```

## Troubleshooting

Common issues and their solutions:

1. **API Key Issues**: Ensure the Stripe API keys are correctly set in the environment variables.
2. **Webhook Errors**: Verify webhook signatures and ensure the webhook URL is accessible.
3. **Payment Failures**: Implement proper error handling for payment failures.
4. **Subscription Status**: Monitor subscription status changes and update the database accordingly.
5. **Testing**: Use Stripe's test mode and test cards for development and testing.

