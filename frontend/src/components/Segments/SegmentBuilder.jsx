import React, { useState } from 'react';
import {
  XMarkIcon,
  PlusIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

const SegmentBuilder = ({ segment, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: segment?.name || '',
    description: segment?.description || '',
    isDynamic: segment?.isDynamic || false,
    filters: segment?.filters || []
  });

  const [currentFilter, setCurrentFilter] = useState({
    field: 'email',
    operator: 'contains',
    value: ''
  });

  const filterFields = [
    { value: 'email', label: 'Email' },
    { value: 'firstName', label: 'First Name' },
    { value: 'lastName', label: 'Last Name' },
    { value: 'status', label: 'Status' }
  ];

  const addFilter = () => {
    if (!currentFilter.value) return;

    setFormData({
      ...formData,
      filters: [...formData.filters, { ...currentFilter }]
    });

    setCurrentFilter({
      field: 'email',
      operator: 'contains',
      value: ''
    });
  };

  const removeFilter = (index) => {
    setFormData({
      ...formData,
      filters: formData.filters.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert('Enter segment name');
      return;
    }

    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-2xl p-6 rounded shadow">

        {/* HEADER */}
        <div className="flex justify-between mb-4">
          <h2 className="text-lg font-bold">
            {segment ? 'Edit Segment' : 'Create Segment'}
          </h2>

          <button onClick={onClose}>
            <XMarkIcon className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* NAME */}
          <input
            type="text"
            placeholder="Segment Name"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            className="w-full border px-3 py-2 rounded"
          />

          {/* DESCRIPTION */}
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full border px-3 py-2 rounded"
          />

          {/* FILTER LIST */}
          <div>
            <h3 className="font-medium mb-2">Filters</h3>

            {formData.filters.map((filter, index) => (
              <div key={index} className="flex items-center gap-2 bg-gray-100 p-2 mb-2 rounded">
                <span>{filter.field}</span>
                <span>{filter.operator}</span>
                <span>{filter.value}</span>

                <button
                  type="button"
                  onClick={() => removeFilter(index)}
                  className="ml-auto text-red-500"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            ))}

            {/* ADD FILTER */}
            <div className="flex gap-2">

              {/* FIELD DROPDOWN (FIXED) */}
              <select
                value={currentFilter.field}
                onChange={(e) =>
                  setCurrentFilter({
                    ...currentFilter,
                    field: e.target.value
                  })
                }
                className="border px-2 py-2 rounded"
              >
                {filterFields.map((field) => (
                  <option key={field.value} value={field.value}>
                    {field.label}
                  </option>
                ))}
              </select>

              {/* VALUE */}
              <input
                placeholder="Value"
                value={currentFilter.value}
                onChange={(e) =>
                  setCurrentFilter({
                    ...currentFilter,
                    value: e.target.value
                  })
                }
                className="flex-1 border px-3 py-2 rounded"
              />

              {/* ADD BTN */}
              <button
                type="button"
                onClick={addFilter}
                className="bg-blue-600 text-white px-3 py-2 rounded"
              >
                <PlusIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* BUTTONS */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="border px-4 py-2 rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Save
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default SegmentBuilder;