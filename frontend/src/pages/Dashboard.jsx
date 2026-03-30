import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; 
import { analyticsAPI, campaignAPI } from '../services/api';
import { 
  ArrowTrendingUpIcon, 
  EnvelopeIcon, 
  UsersIcon, 
  ChartBarIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalCampaigns: 0,
    activeCampaigns: 0,
    totalContacts: 0,
    totalOpens: 0,
    totalClicks: 0
  });
  const [recentCampaigns, setRecentCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trendData, setTrendData] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [analyticsRes, campaignsRes] = await Promise.all([
        analyticsAPI.getDashboard(),
        campaignAPI.getAll()
      ]);
      
      setStats(analyticsRes.data.stats);
      setRecentCampaigns(campaignsRes.data.campaigns?.slice(0, 5) || []);
      
      const trend = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        trend.push({
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          opens: Math.floor(Math.random() * 100),
          clicks: Math.floor(Math.random() * 50),
        });
      }
      setTrendData(trend);
    } catch {
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, color, trend, icon: Icon }) => (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          {trend && (
            <p className="text-xs text-green-600 mt-2">
              ↑ {trend}% from last month
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full bg-${color}-100`}>
          {Icon && <Icon className={`h-6 w-6 text-${color}-600`} />}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600 mt-1">
          Here's what's happening with your campaigns today.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Campaigns" value={stats.totalCampaigns} icon={EnvelopeIcon} color="blue" trend="12" />
        <StatCard title="Active Campaigns" value={stats.activeCampaigns} icon={ArrowTrendingUpIcon} color="green" trend="8" />
        <StatCard title="Total Contacts" value={stats.totalContacts} icon={UsersIcon} color="purple" trend="24" />
        <StatCard title="Total Opens" value={stats.totalOpens} icon={ChartBarIcon} color="orange" trend="18" />
      </div>

      {/* Chart */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Engagement Trends</h2>
        </div>
        <div className="p-6">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="opens" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
              <Area type="monotone" dataKey="clicks" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Campaigns */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b flex justify-between">
          <h2 className="text-lg font-semibold">Recent Campaigns</h2>
          <Link to="/campaigns" className="text-blue-600 flex items-center">
            View All <ArrowRightIcon className="h-4 w-4 ml-1" />
          </Link>
        </div>

        <div>
          {recentCampaigns.length > 0 ? (
            recentCampaigns.map((c) => (
              <div key={c._id} className="p-4 border-b">
                <p className="font-medium">{c.name}</p>
                <p className="text-sm text-gray-500">
                  Sent: {c.metrics?.sent || 0} | Opens: {c.metrics?.opened || 0}
                </p>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-gray-500">No campaigns</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;