/**
 * Service for interacting with Stripe API for subscription management
 */

// Initialize Stripe
const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
let stripePromise = null;

/**
 * Get the Stripe instance
 * @returns {Promise<Stripe>} - The Stripe instance
 */
export const getStripe = async () => {
  if (!stripePromise) {
    stripePromise = import('https://js.stripe.com/v3/').then(Stripe => {
      return Stripe.default(STRIPE_PUBLIC_KEY);
    });
  }
  return stripePromise;
};

/**
 * Create a checkout session for subscription
 * @param {string} priceId - The Stripe price ID for the subscription
 * @param {string} userId - The user ID
 * @param {string} userEmail - The user's email
 * @returns {Promise<string>} - The checkout session ID
 */
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

/**
 * Redirect to Stripe checkout
 * @param {string} sessionId - The checkout session ID
 * @returns {Promise<void>}
 */
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

/**
 * Get customer portal URL
 * @param {string} userId - The user ID
 * @returns {Promise<string>} - The customer portal URL
 */
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

/**
 * Get subscription plans
 * @returns {Promise<Array>} - Array of subscription plans
 */
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

/**
 * Get mock subscription plans (for development)
 * @returns {Array} - Array of mock subscription plans
 */
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

export default {
  getStripe,
  createCheckoutSession,
  redirectToCheckout,
  getCustomerPortalUrl,
  getSubscriptionPlans,
  getMockSubscriptionPlans,
};

