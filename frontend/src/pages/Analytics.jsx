import React, { useState, useEffect, useCallback } from 'react';
import { analyticsAPI, campaignAPI } from '../services/api';
import { Link } from 'react-router-dom';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  CalendarIcon,
  ArrowTrendingUpIcon,
  UsersIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const Analytics = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState({
    totalCampaigns: 0,
    totalContacts: 0,
    totalOpens: 0,
    totalClicks: 0
  });

  // Fetch campaign analytics
  const fetchAnalytics = useCallback(async (campaignId, campaignList = campaigns) => {
    try {
      const response = await analyticsAPI.getCampaignAnalytics(campaignId);

      const campaign = campaignList.find(c => c._id === campaignId);

      setSelectedCampaign(campaign);
      setAnalytics(response.data.analytics);

    } catch {
      toast.error('Failed to fetch campaign analytics');
    }
  }, [campaigns]);

  // Fetch all data
  const fetchData = useCallback(async () => {
    try {
      const [campaignsRes, overviewRes] = await Promise.all([
        campaignAPI.getAll(),
        analyticsAPI.getDashboard()
      ]);

      const data = campaignsRes.data.campaigns || [];

      setCampaigns(data);
      setOverview(overviewRes.data.stats);

      if (data.length > 0) {
        fetchAnalytics(data[0]._id, data);
      }

    } catch {
      toast.error('Failed to fetch analytics data');
    } finally {
      setLoading(false);
    }
  }, [fetchAnalytics]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Track and analyze your campaign performance
        </p>
      </div>

      {/* Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Stat title="Total Campaigns" value={overview.totalCampaigns} icon={EnvelopeIcon} />
        <Stat title="Total Contacts" value={overview.totalContacts} icon={UsersIcon} />
        <Stat title="Total Opens" value={overview.totalOpens} icon={ArrowTrendingUpIcon} />
        <Stat title="Total Clicks" value={overview.totalClicks} icon={CalendarIcon} />
      </div>

      {/* Dropdown */}
      {campaigns.length > 0 && (
        <div className="bg-white rounded-lg shadow mb-8 p-6">
          <label className="block mb-2 text-sm font-medium">
            Select Campaign
          </label>
          <select
            onChange={(e) => fetchAnalytics(e.target.value)}
            className="w-full md:w-96 input-field"
          >
            {campaigns.map(c => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Charts */}
      {selectedCampaign && analytics && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Stat title="Sent" value={selectedCampaign.metrics?.sent || 0} />
            <Stat title="Opens" value={analytics.opens || 0} />
            <Stat title="Clicks" value={analytics.clicks || 0} />
            <Stat title="Conversions" value={analytics.conversions || 0} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Bar Chart */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="mb-4 font-semibold">Performance</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={[
                  { name: 'Sent', value: selectedCampaign.metrics?.sent || 0 },
                  { name: 'Opened', value: analytics.opens || 0 },
                  { name: 'Clicked', value: analytics.clicks || 0 },
                  { name: 'Converted', value: analytics.conversions || 0 }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="mb-4 font-semibold">Engagement</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Opened', value: analytics.opens || 0 },
                      { name: 'Clicked', value: analytics.clicks || 0 },
                      { name: 'Converted', value: analytics.conversions || 0 },
                      {
                        name: 'No Action',
                        value:
                          (selectedCampaign.metrics?.sent || 0) -
                          (analytics.opens || 0)
                      }
                    ]}
                    dataKey="value"
                    outerRadius={100}
                    label
                  >
                    {COLORS.map((color, i) => (
                      <Cell key={i} fill={color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

          </div>
        </>
      )}

      {/* No Campaign */}
      {campaigns.length === 0 && (
        <div className="text-center py-10 bg-white rounded-lg shadow">
          <EnvelopeIcon className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2">No campaigns found</p>
          <Link to="/campaigns/create" className="text-blue-600">
            Create Campaign
          </Link>
        </div>
      )}
    </div>
  );
};

// Stat Card
const Stat = ({ title, value, icon: Icon }) => (
  <div className="bg-white p-4 rounded shadow flex justify-between items-center">
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
    {Icon && <Icon className="h-6 w-6 text-blue-500" />}
  </div>
);

export default Analytics;