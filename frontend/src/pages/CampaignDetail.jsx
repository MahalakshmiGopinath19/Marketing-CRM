import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { campaignAPI } from '../services/api';
import { ArrowLeftIcon, PencilSquareIcon, PlayIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
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
  ResponsiveContainer
} from 'recharts';

const CampaignDetail = () => {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCampaignDetails = useCallback(async () => {
    try {
      const [campaignRes, analyticsRes] = await Promise.all([
        campaignAPI.getById(id),
        campaignAPI.getAnalytics(id)
      ]);

      setCampaign(campaignRes.data.campaign);
      setAnalytics(analyticsRes.data.analytics);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch campaign details');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCampaignDetails();
  }, [fetchCampaignDetails]);

  const handleSend = async () => {
    if (window.confirm('Are you sure you want to send this campaign now?')) {
      try {
        await campaignAPI.send(id);
        toast.success('Campaign sent successfully!');
        fetchCampaignDetails();
      } catch {
        toast.error('Failed to send campaign');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Campaign not found</p>
        <Link to="/campaigns" className="text-blue-600 hover:text-blue-800 mt-2 inline-block">
          Back to Campaigns
        </Link>
      </div>
    );
  }

  const performanceData = [
    { name: 'Sent', value: campaign.metrics?.sent || 0 },
    { name: 'Opened', value: analytics?.opens || 0 },
    { name: 'Clicked', value: analytics?.clicks || 0 },
    { name: 'Converted', value: analytics?.conversions || 0 }
  ];

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

  const openRate = campaign.metrics?.sent
    ? ((analytics?.opens / campaign.metrics.sent) * 100).toFixed(1)
    : 0;

  const clickRate = campaign.metrics?.sent
    ? ((analytics?.clicks / campaign.metrics.sent) * 100).toFixed(1)
    : 0;

  const conversionRate = campaign.metrics?.sent
    ? ((analytics?.conversions / campaign.metrics.sent) * 100).toFixed(1)
    : 0;

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <Link
          to="/campaigns"
          className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          <span>Back to Campaigns</span>
        </Link>

        <div className="flex space-x-2">
          {campaign.status === 'draft' && (
            <button
              onClick={handleSend}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center space-x-2"
            >
              <PlayIcon className="h-4 w-4" />
              <span>Send Now</span>
            </button>
          )}

          <Link
            to={`/campaigns/edit/${campaign._id}`}
            className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 flex items-center space-x-2"
          >
            <PencilSquareIcon className="h-4 w-4" />
            <span>Edit</span>
          </Link>
        </div>
      </div>

      {/* Campaign Info */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="px-6 py-4 border-b">
          <h1 className="text-2xl font-bold">{campaign.name}</h1>
        </div>

        <div className="p-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p>Total Sent</p>
              <p className="text-xl font-bold">{campaign.metrics?.sent || 0}</p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <p>Open Rate</p>
              <p className="text-xl font-bold">{openRate}%</p>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <p>Click Rate</p>
              <p className="text-xl font-bold">{clickRate}%</p>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <p>Conversion Rate</p>
              <p className="text-xl font-bold">{conversionRate}%</p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>

            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={performanceData} dataKey="value" outerRadius={100}>
                  {performanceData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetail;