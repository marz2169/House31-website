import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';

interface DashboardData {
  timestamp: string;
  system: {
    uptime: number;
    memory: {
      heapUsed: number;
      heapTotal: number;
      rss: number;
      external: number;
    };
    platform: string;
    nodeVersion: string;
    environment: string;
  };
  errors: {
    total: number;
    lastHour: number;
    last24Hours: number;
    uptime: number;
    bySevirty: {
      high: number;
      medium: number;
      low: number;
    };
  };
  performance: {
    totalRequests: number;
    averageResponseTime: number;
    slowRequests: number;
    statusCodes: {
      '2xx': number;
      '3xx': number;
      '4xx': number;
      '5xx': number;
    };
    topEndpoints: Array<{
      endpoint: string;
      count: number;
      avgDuration: number;
    }>;
  };
  database: {
    connected: boolean;
  };
}

const MonitoringDashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshInterval] = useState(30000); // 30 seconds
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/monitoring/dashboard');
      if (!response.ok) throw new Error('Failed to fetch dashboard data');
      const data = await response.json();
      setDashboardData(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(fetchDashboardData, refreshInterval);
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval]);

  const formatUptime = (seconds: number): string => {
    const days = Math.floor(seconds / (24 * 60 * 60));
    const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((seconds % (60 * 60)) / 60);
    return `${days}d ${hours}h ${minutes}m`;
  };

  const formatMemory = (bytes: number): number => {
    return Math.round(bytes / 1024 / 1024);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchDashboardData} className="w-full">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">House31 Monitoring Dashboard</h1>
        <div className="flex items-center space-x-4">
          <Button
            variant={autoRefresh ? 'default' : 'outline'}
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            {autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
          </Button>
          <Button onClick={fetchDashboardData} variant="outline">
            Refresh Now
          </Button>
        </div>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-lg font-semibold">Online</span>
            </div>
            <p className="text-sm text-gray-600">
              Uptime: {formatUptime(dashboardData?.system?.uptime || 0)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold">
              {formatMemory(dashboardData?.system?.memory?.heapUsed || 0)} MB
            </div>
            <p className="text-sm text-gray-600">
              of {formatMemory(dashboardData?.system?.memory?.heapTotal || 0)} MB
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Database</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${dashboardData?.database?.connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-lg font-semibold">
                {dashboardData?.database?.connected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Environment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold capitalize">
              {dashboardData?.system?.environment || 'Unknown'}
            </div>
            <p className="text-sm text-gray-600">
              Node {dashboardData?.system?.nodeVersion}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Error Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Error Statistics</CardTitle>
          <CardDescription>Recent error activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {dashboardData?.errors?.total || 0}
              </div>
              <div className="text-sm text-gray-600">Total Errors</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {dashboardData?.errors?.lastHour || 0}
              </div>
              <div className="text-sm text-gray-600">Last Hour</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {dashboardData?.errors?.last24Hours || 0}
              </div>
              <div className="text-sm text-gray-600">Last 24 Hours</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {dashboardData?.errors?.uptime || 0}s
              </div>
              <div className="text-sm text-gray-600">Uptime</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
          <CardDescription>API performance statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {dashboardData?.performance?.totalRequests || 0}
              </div>
              <div className="text-sm text-gray-600">Total Requests</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {dashboardData?.performance?.averageResponseTime || 0}ms
              </div>
              <div className="text-sm text-gray-600">Avg Response Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {dashboardData?.performance?.slowRequests || 0}
              </div>
              <div className="text-sm text-gray-600">Slow Requests</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Codes */}
      {dashboardData?.performance?.statusCodes && (
        <Card>
          <CardHeader>
            <CardTitle>HTTP Status Codes</CardTitle>
            <CardDescription>Request status distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {dashboardData.performance.statusCodes['2xx'] || 0}
                </div>
                <div className="text-sm text-gray-600">2xx Success</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {dashboardData.performance.statusCodes['3xx'] || 0}
                </div>
                <div className="text-sm text-gray-600">3xx Redirect</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {dashboardData.performance.statusCodes['4xx'] || 0}
                </div>
                <div className="text-sm text-gray-600">4xx Client Error</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {dashboardData.performance.statusCodes['5xx'] || 0}
                </div>
                <div className="text-sm text-gray-600">5xx Server Error</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="text-center text-sm text-gray-500">
        Last updated: {new Date().toLocaleString()}
      </div>
    </div>
  );
};

export default MonitoringDashboard;
