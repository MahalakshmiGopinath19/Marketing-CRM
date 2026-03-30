import React from 'react';
import { EnvelopeIcon, TrashIcon, UserCircleIcon } from '@heroicons/react/24/outline';

const ContactList = ({ contacts }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        
        {/* Header */}
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Contact
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Engagement
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>

        {/* Body */}
        <tbody className="bg-white divide-y divide-gray-200">
          {contacts.map((contact) => (
            <tr key={contact._id} className="hover:bg-gray-50 transition-colors">
              
              {/* Contact */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <UserCircleIcon className="h-10 w-10 text-gray-400" />
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {contact.firstName} {contact.lastName}
                    </div>
                    <div className="text-sm text-gray-500">
                      Joined {new Date(contact.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </td>

              {/* Email */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{contact.email}</div>
              </td>

              {/* Status */}
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`badge ${
                  contact.status === 'active' ? 'badge-success' : 'badge-danger'
                }`}>
                  {contact.status}
                </span>
              </td>

              {/* Engagement */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  Opens: {contact.engagement?.totalOpens || 0}
                </div>
                <div className="text-sm text-gray-500">
                  Clicks: {contact.engagement?.totalClicks || 0}
                </div>
              </td>

              {/* Actions */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <button
                  className="text-blue-600 hover:text-blue-900 mr-3 transition-colors"
                  title="Send Email"
                >
                  <EnvelopeIcon className="h-5 w-5" />
                </button>

                <button
                  className="text-red-600 hover:text-red-900 transition-colors"
                  title="Delete"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ContactList;