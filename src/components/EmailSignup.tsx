import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface EmailSignupProps {
  onSubmit: (email: string) => void;
  callToAction?: string;
  placeholder?: string;
  isLoading?: boolean;
}

const EmailSignup: React.FC<EmailSignupProps> = ({
  onSubmit,
  callToAction = "Get my new song delivered to your inbox",
  placeholder = "Your Email Address",
  isLoading = false
}) => {
  const [email, setEmail] = useState('');
  const [isValid, setIsValid] = useState(true);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      setIsValid(false);
      return;
    }
    
    setIsValid(true);
    onSubmit(email);
    setEmail('');
  };

  return (
    <div className="max-w-md mx-auto mb-16">
      <h3 className="text-2xl md:text-3xl font-semibold text-white mb-4 text-center">
        {callToAction}
      </h3>
      <p className="text-gray-300 mb-6 text-sm text-center">
        🎵 Exclusive early access • 📧 Direct to your inbox • 🚫 No spam, ever
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setIsValid(true);
            }}
            required
            className={`modern-input w-full text-base ${
              !isValid ? 'border-red-500' : ''
            }`}
          />
          {!isValid && (
            <p className="text-red-400 text-sm mt-1">Please enter a valid email address</p>
          )}
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="modern-button-primary w-full py-3 px-6 text-base font-medium bg-white text-black hover:bg-gray-100 disabled:opacity-50"
        >
          {isLoading ? '⏳ SENDING...' : '🔥 GET MY TRACK NOW'}
        </button>
      </form>
    </div>
  );
};

export default EmailSignup;