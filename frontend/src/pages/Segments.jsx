import React, { useState, useEffect } from 'react';
import { segmentAPI } from '../services/api';
import {
  PlusIcon,
  TrashIcon,
  PencilIcon,
  EyeIcon,
  UsersIcon
} from '@heroicons/react/24/outline';

import SegmentBuilder from '../components/Segments/SegmentBuilder';
import toast from 'react-hot-toast';

const Segments = () => {
  const [segments, setSegments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBuilder, setShowBuilder] = useState(false);
  const [editingSegment, setEditingSegment] = useState(null);

  useEffect(() => {
    fetchSegments();
  }, []);

  const fetchSegments = async () => {
    try {
      const response = await segmentAPI.getAll();
      setSegments(response.data.segments);
    } catch {
      toast.error('Failed to fetch segments');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSegment = async (segmentData) => {
    try {
      if (editingSegment) {
        await segmentAPI.update(editingSegment._id, segmentData);
        toast.success('Segment updated successfully');
      } else {
        await segmentAPI.create(segmentData);
        toast.success('Segment created successfully');
      }

      fetchSegments();
      setShowBuilder(false);
      setEditingSegment(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save segment');
    }
  };

  const handleDeleteSegment = async (id) => {
    if (!window.confirm('Delete this segment?')) return;

    try {
      await segmentAPI.delete(id);
      toast.success('Segment deleted successfully');
      fetchSegments();
    } catch {
      toast.error('Failed to delete segment');
    }
  };

  const handlePreview = async (id) => {
    try {
      const response = await segmentAPI.preview(id);
      toast.success(`This segment contains ${response.data.size} contacts`);
    } catch {
      toast.error('Failed to preview segment');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-12 w-12 border-b-2 border-blue-600 rounded-full"></div>
      </div>
    );
  }

  return (
    <div>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Segments</h1>
          <p className="text-gray-600">Manage audience segments</p>
        </div>

        <button
          onClick={() => {
            setEditingSegment(null);
            setShowBuilder(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <PlusIcon className="h-5 w-5" />
          Create
        </button>
      </div>

      {/* SEGMENTS GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {segments.map((segment) => (
          <div key={segment._id} className="bg-white p-6 rounded shadow">
            <div className="flex justify-between mb-3">
              <h3 className="font-semibold">{segment.name}</h3>

              <div className="flex gap-2">
                <EyeIcon
                  className="h-5 w-5 cursor-pointer"
                  onClick={() => handlePreview(segment._id)}
                />
                <PencilIcon
                  className="h-5 w-5 cursor-pointer"
                  onClick={() => {
                    setEditingSegment(segment);
                    setShowBuilder(true);
                  }}
                />
                <TrashIcon
                  className="h-5 w-5 cursor-pointer text-red-500"
                  onClick={() => handleDeleteSegment(segment._id)}
                />
              </div>
            </div>

            <div className="text-sm text-gray-600 flex items-center gap-1">
              <UsersIcon className="h-4 w-4" />
              {segment.size} contacts
            </div>
          </div>
        ))}
      </div>

      {/* EMPTY */}
      {segments.length === 0 && (
        <div className="text-center mt-10">
          <p>No segments yet</p>
        </div>
      )}

      {/* BUILDER */}
      {showBuilder && (
        <SegmentBuilder
          segment={editingSegment}
          onSave={handleSaveSegment}
          onClose={() => {
            setShowBuilder(false);
            setEditingSegment(null);
          }}
        />
      )}
    </div>
  );
};

export default Segments;