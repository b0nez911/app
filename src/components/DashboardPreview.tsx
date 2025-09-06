import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Home, RotateCcw, BookOpen, BarChart3, Gift, Search, LogIn } from 'lucide-react';

export const DashboardPreview: React.FC = () => {
  return (
    <div className="relative z-10 px-8 pb-20">
      <div className="max-w-6xl mx-auto">
        {/* Dashboard Container */}
        <div className="modern-card overflow-hidden">
          {/* Dashboard Navigation */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center space-x-6">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-purple-600 rounded-full"></div>
              </div>
              <div className="flex items-center space-x-6 text-white/80">
                <div className="flex items-center gap-2 text-white">
                  <Home className="h-4 w-4" />
                  <span className="text-sm font-medium">Home</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="h-4 w-4" />
                  <span className="text-sm font-medium">Requests</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span className="text-sm font-medium">Skills</span>
                </div>
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  <span className="text-sm font-medium">Leaderboard</span>
                </div>
                <div className="flex items-center gap-2">
                  <Gift className="h-4 w-4" />
                  <span className="text-sm font-medium">Rewards</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
                <input 
                  placeholder="search" 
                  className="modern-input pl-10 w-48"
                />
              </div>
              <button className="modern-button-secondary">
                Login
              </button>
              <button className="modern-button-primary">
                Sign up
              </button>
            </div>
          </div>
          
          {/* Dashboard Content */}
          <div className="p-8">
            <div className="mb-6">
              <div className="modern-badge bg-purple-600/20 text-purple-300">
                AI Optimised
              </div>
            </div>
            
            <h2 className="text-3xl font-semibold text-white mb-4">
              Help out, Reach out.
            </h2>
            
            <p className="text-white/60 mb-8 max-w-2xl text-sm leading-relaxed">
              Offer support for those in need, or ask for help and describe
              <br />
              your personal issue.
            </p>
            
            <div className="flex items-center gap-4 mb-8">
              <button className="modern-button-primary">
                Need Help
              </button>
              <button className="modern-button-secondary">
                Offering Support
              </button>
              <input 
                placeholder="What do you need help with?" 
                className="modern-input flex-1 max-w-md"
              />
              <button className="modern-button-primary">
                Search
              </button>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <div className="modern-badge">Financial Aid</div>
              <div className="modern-badge">Moving</div>
              <div className="modern-badge">Resumes</div>
              <div className="modern-badge">Healthcare</div>
              <div className="modern-badge">Legal Counsel</div>
              <div className="modern-badge">Building Advice</div>
              <div className="modern-badge">More +</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};