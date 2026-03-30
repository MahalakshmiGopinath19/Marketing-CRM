import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { campaignAPI, segmentAPI } from '../services/api';
import toast from 'react-hot-toast';

const EditCampaign = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [segments, setSegments] = useState([]);
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [campaignRes, segmentsRes] = await Promise.all([
          campaignAPI.getById(id),
          segmentAPI.getAll()
        ]);

        setFormData(campaignRes.data.campaign);
        setSegments(segmentsRes.data.segments);
      } catch {
        toast.error('Failed to fetch campaign data');
        navigate('/campaigns');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await campaignAPI.update(id, formData);
      toast.success('Campaign updated successfully!');
      navigate(`/campaigns/${id}`);
    } catch {
      toast.error('Failed to update campaign');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !formData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit Campaign</h1>
        <p className="text-gray-600 mt-1">Update your campaign details</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* BASIC */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Basic Information</h2>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="input-field"
              required
            />

            <select
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
              className="input-field"
            >
              <option value="email">Email</option>
              <option value="sms">SMS</option>
            </select>
          </div>
        </div>

        {/* SEGMENTS */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-semibold mb-4">Target Audience</h2>

          <select
            multiple
            value={formData.targetAudience?.segments || []}
            onChange={(e) => {
              const selected = Array.from(
                e.target.selectedOptions,
                (o) => o.value
              );

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
            {segments.map((seg) => (
              <option key={seg._id} value={seg._id}>
                {seg.name}
              </option>
            ))}
          </select>
        </div>

        {/* CONTENT */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-semibold mb-4">Content</h2>

          <input
            type="text"
            value={formData.content?.subject || ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                content: {
                  ...formData.content,
                  subject: e.target.value
                }
              })
            }
            className="input-field"
          />

          <textarea
            rows={8}
            value={formData.content?.html || ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                content: {
                  ...formData.content,
                  html: e.target.value
                }
              })
            }
            className="input-field mt-2"
          />
        </div>

        {/* BUTTONS */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate(`/campaigns/${id}`)}
            className="border px-4 py-2 rounded"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCampaign;