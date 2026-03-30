import React from 'react';
import { Link } from 'react-router-dom';
import { campaignAPI } from '../../services/api';
import { PencilSquareIcon, TrashIcon, PlayIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const CampaignCard = ({ campaign, onUpdate }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'badge-success';
      case 'scheduled': return 'badge-warning';
      case 'completed': return 'badge-info';
      case 'paused': return 'badge-danger';
      default: return 'badge';
    }
  };

  const getStatusText = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const handleSend = async () => {
    if (window.confirm('Are you sure you want to send this campaign now?')) {
      try {
        await campaignAPI.send(campaign._id);
        toast.success('Campaign sent successfully!');
        onUpdate();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to send campaign');
      }
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this campaign? This action cannot be undone.')) {
      try {
        await campaignAPI.delete(campaign._id);
        toast.success('Campaign deleted successfully!');
        onUpdate();
      } catch {
        toast.error('Failed to delete campaign');
      }
    }
  };

  const calculateRate = (metric, total) => {
    if (!total) return 0;
    return ((metric / total) * 100).toFixed(1);
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:transform hover:scale-105">
      <div className="p-6">
        
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
              {campaign.name}
            </h3>
            <p className="text-sm text-gray-500 mt-1 capitalize">
              Type: {campaign.type}
            </p>
          </div>

          <span className={`badge ${getStatusColor(campaign.status)}`}>
            {getStatusText(campaign.status)}
          </span>
        </div>

        {/* Metrics */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Sent:</span>
            <span className="font-medium">{campaign.metrics?.sent || 0}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Open Rate:</span>
            <span className="font-medium">
              {calculateRate(campaign.metrics?.opened, campaign.metrics?.sent)}%
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Click Rate:</span>
            <span className="font-medium">
              {calculateRate(campaign.metrics?.clicked, campaign.metrics?.sent)}%
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
          
          <Link
            to={`/campaigns/${campaign._id}`}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center space-x-1"
          >
            <ChartBarIcon className="h-4 w-4" />
            <span>Analytics</span>
          </Link>

          <div className="flex space-x-2">
            
            {campaign.status === 'draft' && (
              <button
                onClick={handleSend}
                className="text-green-600 hover:text-green-800 transition-colors"
                title="Send Campaign"
              >
                <PlayIcon className="h-5 w-5" />
              </button>
            )}

            <Link
              to={`/campaigns/edit/${campaign._id}`}
              className="text-yellow-600 hover:text-yellow-800 transition-colors"
              title="Edit"
            >
              <PencilSquareIcon className="h-5 w-5" />
            </Link>

            <button
              onClick={handleDelete}
              className="text-red-600 hover:text-red-800 transition-colors"
              title="Delete"
            >
              <TrashIcon className="h-5 w-5" />
            </button>

          </div>
        </div>

      </div>
    </div>
  );
};

export default CampaignCard;