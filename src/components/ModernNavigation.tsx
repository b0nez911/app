import React from 'react';
import { FileText, Library, Bookmark, MessageCircle } from 'lucide-react';

interface ModernNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const ModernNavigation: React.FC<ModernNavigationProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'generate', label: 'Generate Posts', icon: FileText },
    { id: 'posts', label: 'Posts Library', icon: Library },
    { id: 'saved', label: 'Saved Posts', icon: Bookmark },
    { id: 'reddit', label: 'Reddit Posts', icon: MessageCircle }
  ];

  return (
    <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-slate-800/90 backdrop-blur-md border border-slate-700/50 rounded-full px-2 py-2 shadow-2xl">
        <div className="flex space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeTab === item.id
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export { ModernNavigation };
export default ModernNavigation;