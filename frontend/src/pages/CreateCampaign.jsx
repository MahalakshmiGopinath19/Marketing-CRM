import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { campaignAPI, segmentAPI } from '../services/api';
import toast from 'react-hot-toast';

const CreateCampaign = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [segments, setSegments] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    type: 'email',
    status: 'draft',
    targetAudience: {
      segments: [],
      filters: {}
    },
    content: {
      subject: '',
      body: '',
      html: '<html><body><h1>Hello!</h1><p>Your campaign content here...</p></body></html>'
    },
    schedule: {
      startDate: '',
      frequency: 'once'
    },
    budget: {
      amount: 0,
      currency: 'USD'
    }
  });

  useEffect(() => {
    fetchSegments();
  }, []);

  const fetchSegments = async () => {
    try {
      const response = await segmentAPI.getAll();
      setSegments(response.data.segments);
    } catch {
      toast.error('Failed to fetch segments');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Please enter a campaign name');
      return;
    }
    
    if (!formData.content.subject.trim()) {
      toast.error('Please enter a subject line');
      return;
    }
    
    setLoading(true);

    try {
      await campaignAPI.create(formData);
      toast.success('Campaign created successfully!');
      navigate('/campaigns');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create campaign');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Create New Campaign</h1>
        <p className="text-gray-600 mt-1">Set up your marketing campaign</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Campaign Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-field"
                placeholder="e.g., Summer Sale Newsletter"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Campaign Type *
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="input-field"
                required
              >
                <option value="email">Email Marketing</option>
                <option value="sms">SMS Marketing</option>
                <option value="push">Push Notification</option>
                <option value="social">Social Media</option>
              </select>
            </div>
          </div>
        </div>

        {/* Target Audience */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Target Audience</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Segments
            </label>
            <select
              multiple
              value={formData.targetAudience.segments}
              onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions, option => option.value);
                setFormData({
                  ...formData,
                  targetAudience: {
                    ...formData.targetAudience,
                    segments: selected
                  }
                });
              }}
              className="input-field h-32"
            >
              {segments.map(segment => (
                <option key={segment._id} value={segment._id}>
                  {segment.name} ({segment.size} contacts)
                </option>
              ))}
            </select>
            <p className="text-sm text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple segments</p>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Campaign Content</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject Line *
              </label>
              <input
                type="text"
                value={formData.content.subject}
                onChange={(e) => setFormData({
                  ...formData,
                  content: { ...formData.content, subject: e.target.value }
                })}
                className="input-field"
                placeholder="e.g., Don't miss out on our summer sale!"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Content (HTML)
              </label>
              <textarea
                rows={12}
                value={formData.content.html}
                onChange={(e) => setFormData({
                  ...formData,
                  content: { ...formData.content, html: e.target.value }
                })}
                className="input-field font-mono text-sm"
                placeholder="<html><body><h1>Hello!</h1><p>Your campaign content here...</p></body></html>"
              />
              <p className="text-sm text-gray-500 mt-1">
                You can use HTML to create beautiful emails. Include images, links, and styling.
              </p>
            </div>
          </div>
        </div>

        {/* Schedule */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Schedule</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="datetime-local"
                value={formData.schedule.startDate}
                onChange={(e) => setFormData({
                  ...formData,
                  schedule: { ...formData.schedule, startDate: e.target.value }
                })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Frequency
              </label>
              <select
                value={formData.schedule.frequency}
                onChange={(e) => setFormData({
                  ...formData,
                  schedule: { ...formData.schedule, frequency: e.target.value }
                })}
                className="input-field"
              >
                <option value="once">Once</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>
        </div>

        {/* Budget */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Budget</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Budget Amount
              </label>
              <input
                type="number"
                value={formData.budget.amount}
                onChange={(e) => setFormData({
                  ...formData,
                  budget: { ...formData.budget, amount: parseFloat(e.target.value) }
                })}
                className="input-field"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Currency
              </label>
              <select
                value={formData.budget.currency}
                onChange={(e) => setFormData({
                  ...formData,
                  budget: { ...formData.budget, currency: e.target.value }
                })}
                className="input-field"
              >
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="INR">INR - Indian Rupee</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/campaigns')}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Creating...' : 'Create Campaign'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCampaign;