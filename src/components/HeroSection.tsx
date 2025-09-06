import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <div className="relative z-10 text-center px-8 py-20">
      <h1 className="text-5xl md:text-6xl font-semibold text-white mb-6 leading-tight">
        The all-in-one trading
        <br />
        system for teams
      </h1>
      
      <p className="text-lg text-white/70 mb-12 max-w-2xl mx-auto leading-relaxed">
        Consolidate your projects into a uniformed and centralised
        <br />
        control center. No credit card required.
      </p>
      
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
        <button className="modern-button-primary text-black bg-white hover:bg-gray-100 px-8 py-3 text-base font-medium flex items-center gap-2">
          Get Started
          <ChevronRight className="h-4 w-4" />
        </button>
        <button className="modern-button-secondary px-8 py-3 text-base">
          Learn More
        </button>
      </div>
      
      <div className="flex items-center justify-center gap-8 text-white/60">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
          <span className="text-sm font-medium">Services</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
          <span className="text-sm font-medium">Requests</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <span className="text-sm font-medium">Charity</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
          <span className="text-sm font-medium">Exchange</span>
        </div>
      </div>
    </div>
  );
};