import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, TrendingUp, Calendar, MousePointer } from 'lucide-react';

interface ClickData {
  id: string;
  originalUrl: string;
  trackingId: string;
  postTitle: string;
  clickedAt: string;
  clicks: number;
}

const ClickAnalytics: React.FC = () => {
  const [clickData, setClickData] = useState<ClickData[]>([]);
  const [totalClicks, setTotalClicks] = useState(0);

  useEffect(() => {
    // Mock data for demonstration
    const mockData: ClickData[] = [
      {
        id: '1',
        originalUrl: 'https://example.com/music-video',
        trackingId: 'track_abc123',
        postTitle: 'Check out this amazing new track!',
        clickedAt: '2024-01-15T10:30:00Z',
        clicks: 15
      },
      {
        id: '2',
        originalUrl: 'https://spotify.com/artist/example',
        trackingId: 'track_def456',
        postTitle: 'My latest album is now live',
        clickedAt: '2024-01-14T14:20:00Z',
        clicks: 8
      }
    ];
    
    setClickData(mockData);
    setTotalClicks(mockData.reduce((sum, item) => sum + item.clicks, 0));
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Clicks</p>
                <p className="text-2xl font-bold text-white">{totalClicks}</p>
              </div>
              <MousePointer className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Active Links</p>
                <p className="text-2xl font-bold text-white">{clickData.length}</p>
              </div>
              <ExternalLink className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Avg Clicks/Link</p>
                <p className="text-2xl font-bold text-white">
                  {clickData.length > 0 ? Math.round(totalClicks / clickData.length) : 0}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Link Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {clickData.length > 0 ? (
              clickData.map((item) => (
                <div key={item.id} className="bg-slate-700 p-4 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-white font-medium mb-1">{item.postTitle}</h3>
                      <p className="text-slate-400 text-sm mb-2 truncate">{item.originalUrl}</p>
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <span>Created: {formatDate(item.clickedAt)}</span>
                        <span>ID: {item.trackingId}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary" className="bg-blue-600 text-white">
                        {item.clicks} clicks
                      </Badge>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-400 text-center py-8">
                No trackable links created yet. Generate posts with "Click Link Posted" CTA to see analytics here.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClickAnalytics;