import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const NewsletterSignup = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubscribed(true);
      setEmail('');
    }, 1500);
  };

  const benefits = [
    {
      icon: "Zap",
      text: "Weekly impact updates"
    },
    {
      icon: "Bell",
      text: "New project notifications"
    },
    {
      icon: "TrendingUp",
      text: "Market insights & trends"
    },
    {
      icon: "Users",
      text: "Community highlights"
    }
  ];

  if (isSubscribed) {
    return (
      <section className="py-16 bg-primary/5">
        <div className="max-w-4xl mx-auto px-4 lg:px-6 text-center">
          <div className="bg-card rounded-2xl p-8 md:p-12 organic-shadow-moderate border border-border">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Icon name="CheckCircle" size={32} className="text-primary" />
            </div>
            
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Welcome to the Community!
            </h2>
            
            <p className="text-lg text-muted-foreground mb-8">
              Thank you for subscribing! You'll receive your first newsletter with the latest climate action updates soon.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="default" 
                iconName="TreePine" 
                iconPosition="left"
                onClick={() => window.location.href = '/projects-listing'}
              >
                Explore Projects
              </Button>
              
              <Button 
                variant="outline" 
                iconName="Plus" 
                iconPosition="left"
                onClick={() => window.location.href = '/submit-project'}
              >
                Submit Project
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-primary/5">
      <div className="max-w-4xl mx-auto px-4 lg:px-6">
        <div className="bg-card rounded-2xl p-8 md:p-12 organic-shadow-moderate border border-border">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Icon name="Mail" size={32} className="text-primary" />
            </div>
            
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Stay Updated on Climate Action
            </h2>
            
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join our community newsletter to receive the latest updates on verified climate projects, tokenization opportunities, and environmental impact metrics.
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Icon name={benefit.icon} size={20} className="text-accent" />
                </div>
                <p className="text-sm text-muted-foreground">
                  {benefit.text}
                </p>
              </div>
            ))}
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={error}
                  className="w-full"
                />
              </div>
              
              <Button
                type="submit"
                variant="default"
                loading={isLoading}
                iconName="Send"
                iconPosition="right"
                className="sm:w-auto"
              >
                Subscribe
              </Button>
            </div>
          </form>

          {/* Privacy Note */}
          <div className="text-center mt-6">
            <p className="text-xs text-muted-foreground">
              We respect your privacy. Unsubscribe at any time. 
              <br className="sm:hidden" />
              <span className="hidden sm:inline"> • </span>
              No spam, just valuable climate action insights.
            </p>
          </div>

          {/* Social Proof */}
          <div className="flex items-center justify-center space-x-6 mt-8 pt-8 border-t border-border">
            <div className="text-center">
              <div className="text-lg font-bold text-foreground">3,420+</div>
              <div className="text-xs text-muted-foreground">Subscribers</div>
            </div>
            <div className="w-px h-8 bg-border"></div>
            <div className="text-center">
              <div className="text-lg font-bold text-foreground">Weekly</div>
              <div className="text-xs text-muted-foreground">Updates</div>
            </div>
            <div className="w-px h-8 bg-border"></div>
            <div className="text-center">
              <div className="text-lg font-bold text-foreground">4.9★</div>
              <div className="text-xs text-muted-foreground">Rating</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSignup;