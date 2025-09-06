import React from 'react';
import { Button } from '@/components/ui/button';

export const Navigation: React.FC = () => {
  return (
    <nav className="flex items-center justify-between px-8 py-6 relative z-10">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
          <div className="w-4 h-4 bg-purple-600 rounded-full"></div>
        </div>
        <span className="text-white font-semibold text-lg">Traider</span>
      </div>
      
      <div className="hidden md:flex items-center space-x-8">
        <a href="#" className="text-white/70 hover:text-white transition-colors text-sm font-medium">Features</a>
        <a href="#" className="text-white/70 hover:text-white transition-colors text-sm font-medium">AI</a>
        <a href="#" className="text-white/70 hover:text-white transition-colors text-sm font-medium">Pricing</a>
        <a href="#" className="text-white/70 hover:text-white transition-colors text-sm font-medium">Customers</a>
        <a href="#" className="text-white/70 hover:text-white transition-colors text-sm font-medium">Templates</a>
        <a href="#" className="text-white/70 hover:text-white transition-colors text-sm font-medium">Contact</a>
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="modern-button-secondary">
          Sign In
        </button>
        <button className="modern-button-primary px-6">
          Get Started
        </button>
      </div>
    </nav>
  );
};