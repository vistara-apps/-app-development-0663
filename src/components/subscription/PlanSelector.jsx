import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getMockSubscriptionPlans, createCheckoutSession, redirectToCheckout } from '../../services/stripe';
import { Check, AlertCircle, Zap } from 'lucide-react';

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
  
  return (
    <div className="glass-card rounded-lg p-6">
      <h3 className="text-xl font-semibold text-white mb-6">Subscription Plans</h3>
      
      {error && (
        <div className="mb-6 p-3 bg-red-500/20 border border-red-500/30 rounded-lg flex items-start space-x-2">
          <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-white/90 text-sm">{error}</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative rounded-lg p-6 transition-all duration-200 ${
              selectedPlan === plan.id
                ? 'bg-gradient-to-r from-purple-500 to-blue-500 transform scale-105 shadow-lg'
                : 'bg-white/5 hover:bg-white/10'
            } ${
              plan.isPopular ? 'border-2 border-purple-400' : 'border border-white/10'
            }`}
          >
            {plan.isPopular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                MOST POPULAR
              </div>
            )}
            
            <div className="text-center mb-4">
              <h4 className="text-xl font-bold text-white mb-1">{plan.name}</h4>
              <p className="text-white/60 text-sm mb-4">{plan.description}</p>
              <div className="flex items-baseline justify-center">
                <span className="text-3xl font-bold text-white">${plan.price}</span>
                {plan.price > 0 && (
                  <span className="text-white/60 text-sm ml-1">/month</span>
                )}
              </div>
            </div>
            
            <ul className="space-y-3 mb-6">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <Check className={`h-5 w-5 mr-2 flex-shrink-0 ${
                    selectedPlan === plan.id ? 'text-white' : 'text-purple-400'
                  }`} />
                  <span className={selectedPlan === plan.id ? 'text-white' : 'text-white/80'}>
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
            
            <button
              onClick={() => handleSelectPlan(plan.id)}
              className={`w-full py-2 rounded-lg font-medium transition-colors ${
                selectedPlan === plan.id
                  ? 'bg-white text-purple-600'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {subscription && subscription.tier === plan.id
                ? 'Current Plan'
                : 'Select Plan'}
            </button>
          </div>
        ))}
      </div>
      
      {selectedPlan && (
        <div className="text-center">
          <button
            onClick={handleSubscribe}
            disabled={isLoading || (subscription && subscription.tier === selectedPlan)}
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:from-gray-400 disabled:to-gray-500 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed inline-flex items-center"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                <span>Processing...</span>
              </>
            ) : subscription && subscription.tier === selectedPlan ? (
              'Current Plan'
            ) : (
              <>
                <Zap className="h-5 w-5 mr-2" />
                <span>Subscribe Now</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default PlanSelector;

