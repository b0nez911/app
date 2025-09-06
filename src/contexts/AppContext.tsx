import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from '@/components/ui/use-toast';

interface AppContextType {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  includeHashtags: boolean;
  includeEmojis: boolean;
  toggleHashtags: () => void;
  toggleEmojis: () => void;
  includeSongLink: boolean;
  songLink: string;
  toggleSongLink: () => void;
  setSongLink: (link: string) => void;
}

const defaultAppContext: AppContextType = {
  sidebarOpen: false,
  toggleSidebar: () => {},
  includeHashtags: true,
  includeEmojis: true,
  toggleHashtags: () => {},
  toggleEmojis: () => {},
  includeSongLink: false,
  songLink: '',
  toggleSongLink: () => {},
  setSongLink: () => {},
};

const AppContext = createContext<AppContextType>(defaultAppContext);

export const useAppContext = () => useContext(AppContext);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [includeHashtags, setIncludeHashtags] = useState(true);
  const [includeEmojis, setIncludeEmojis] = useState(true);
  const [includeSongLink, setIncludeSongLink] = useState(false);
  const [songLink, setSongLinkState] = useState('');

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  const toggleHashtags = () => {
    setIncludeHashtags(prev => !prev);
  };

  const toggleEmojis = () => {
    setIncludeEmojis(prev => !prev);
  };

  const toggleSongLink = () => {
    setIncludeSongLink(prev => !prev);
  };

  const setSongLink = (link: string) => {
    setSongLinkState(link);
  };

  return (
    <AppContext.Provider
      value={{
        sidebarOpen,
        toggleSidebar,
        includeHashtags,
        includeEmojis,
        toggleHashtags,
        toggleEmojis,
        includeSongLink,
        songLink,
        toggleSongLink,
        setSongLink,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
