import React from 'react';
import AuthWrapper from '@/components/AuthWrapper';
import { AppProvider } from '@/contexts/AppContext';
import AppLayout from '@/components/AppLayout';

const Index: React.FC = () => {
  return (
    <AuthWrapper>
      <AppProvider>
        <AppLayout />
      </AppProvider>
    </AuthWrapper>
  );
};

export default Index;