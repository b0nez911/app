import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

const ConnectRedditButton = () => {
  const handleConnect = () => {
    const clientId = import.meta.env.VITE_REDDIT_CLIENT_ID;
    
    if (!clientId) {
      alert('Reddit Client ID is not configured. Please check your environment variables.');
      return;
    }

    const state = crypto.randomUUID();
    const scope = "identity submit read";
    const redirectUri = 'https://siqczkwddpwruwhwwzzh.supabase.co/functions/v1/reddit-auth-callback';
    const authUrl = `https://www.reddit.com/api/v1/authorize?client_id=${clientId}&response_type=code&state=${state}&redirect_uri=${encodeURIComponent(redirectUri)}&duration=permanent&scope=${encodeURIComponent(scope)}`;
    
    window.location.href = authUrl;
  };

  return (
    <Button 
      onClick={handleConnect}
      className="bg-orange-600 hover:bg-orange-700 text-white font-medium px-6 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
    >
      <ExternalLink className="h-4 w-4" />
      Connect to Reddit
    </Button>
  );
};

export default ConnectRedditButton;