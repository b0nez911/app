import React, { useEffect } from 'react';
import { AuthWrapper } from '@/components/AuthWrapper';
import SteppedDashboard from '@/components/SteppedDashboard';

const AppLayout: React.FC = () => {
  useEffect(() => {
    // Check for Reddit auth callback parameters
    const urlParams = new URLSearchParams(window.location.search);
    const redditAuth = urlParams.get('reddit_auth');
    const accessToken = urlParams.get('access_token');
    const errorMessage = urlParams.get('message');

    if (redditAuth === 'success' && accessToken) {
      // Store the access token
      localStorage.setItem('reddit_access_token', accessToken);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
      // Show success message
      alert('Reddit connected successfully!');
    } else if (redditAuth === 'error') {
      alert(`Reddit connection failed: ${errorMessage || 'Unknown error'}`);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  return (
    <AuthWrapper>
      <SteppedDashboard />
    </AuthWrapper>
  );
};

export default AppLayout;