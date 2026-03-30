import React, { useState } from 'react';
import { XMarkIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';

const ImportContacts = ({ onClose, onImport }) => {
  const [csvData, setCsvData] = useState('');
  const [parsing, setParsing] = useState(false);

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCsvData(event.target.result);
      };
      reader.readAsText(uploadedFile);
    }
  };

  const parseCSV = () => {
    setParsing(true);
    try {
      const lines = csvData.split('\n');
      const headers = lines[0].split(',').map(h => h.trim());

      const contacts = [];

      for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim()) {
          const values = lines[i].split(',');
          const contact = {};

          headers.forEach((header, index) => {
            contact[header] = values[index]?.trim();
          });

          if (contact.email) {
            contacts.push(contact);
          }
        }
      }

      if (contacts.length === 0) {
        throw new Error('No valid contacts found. Make sure you have an email column.');
      }

      onImport(contacts);
    } catch (error) {
      alert(error.message);
    } finally {
      setParsing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Import Contacts
          </h3>

          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Upload */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload CSV File
          </label>

          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              
              <ArrowUpTrayIcon className="mx-auto h-12 w-12 text-gray-400" />

              <div className="flex text-sm text-gray-600">
                <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                  <span>Upload a file</span>
                  <input
                    type="file"
                    className="sr-only"
                    accept=".csv"
                    onChange={handleFileUpload}
                  />
                </label>

                <p className="pl-1">or drag and drop</p>
              </div>

              <p className="text-xs text-gray-500">
                CSV file up to 10MB
              </p>
            </div>
          </div>
        </div>

        {/* Textarea */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Or Paste CSV Data
          </label>

          <textarea
            rows={8}
            value={csvData}
            onChange={(e) => setCsvData(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            placeholder={`email,firstName,lastName,phone
john@example.com,John,Doe,+1234567890
jane@example.com,Jane,Smith,+0987654321`}
          />

          <p className="text-sm text-gray-500 mt-1">
            First row should be headers. Required column: email
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={parseCSV}
            disabled={!csvData || parsing}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {parsing ? 'Importing...' : 'Import Contacts'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default ImportContacts;