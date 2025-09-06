import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bot, Shield } from 'lucide-react';

interface AuthWrapperProps {
  children: React.ReactNode;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  // Check if user is already authenticated
  useEffect(() => {
    const authToken = localStorage.getItem('dealai_auth_token');
    if (authToken) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    
    // Simulate Deal.ai authentication
    setTimeout(() => {
      localStorage.setItem('dealai_auth_token', 'mock_token_' + Date.now());
      localStorage.setItem('user_email', email);
      setIsAuthenticated(true);
      setLoading(false);
    }, 1500);
  };

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-6">
      <Card className="w-full max-w-md bg-slate-800 border-slate-700">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <Bot className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl text-white">Reddit Brand Promoter</CardTitle>
          <p className="text-slate-400">Sign in with your Deal.ai account</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>
          <Button 
            onClick={handleLogin}
            disabled={!email || loading}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Authenticating...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Sign In with Deal.ai
              </div>
            )}
          </Button>
          <p className="text-xs text-slate-500 text-center">
            Powered by Deal.ai white label authentication
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export { AuthWrapper };
export default AuthWrapper;