import React, { useState, useEffect, useCallback } from 'react';
import { contactAPI } from '../services/api';
import {
  PlusIcon,
  ArrowUpTrayIcon,
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  UsersIcon
} from '@heroicons/react/24/outline';

import ContactList from '../components/Contacts/ContactList';
import ImportContacts from '../components/Contacts/ImportContacts';
import toast from 'react-hot-toast';

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);

  // ADD CONTACT STATES
  const [showAddModal, setShowAddModal] = useState(false);
  const [newContact, setNewContact] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  });

  // FETCH CONTACTS
  const fetchContacts = useCallback(async () => {
    try {
      const response = await contactAPI.getAll({
        search,
        page: pagination.currentPage,
        limit: 20
      });

      setContacts(response.data.contacts || []);

      setPagination({
        currentPage: response.data.currentPage || 1,
        totalPages: response.data.totalPages || 1,
        total: response.data.total || 0
      });

    } catch {
      toast.error('Failed to fetch contacts');
    } finally {
      setLoading(false);
    }
  }, [search, pagination.currentPage]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  // ADD CONTACT FUNCTION
  const handleAddContact = async () => {
    try {
      await contactAPI.create(newContact);

      toast.success('Contact added successfully');

      setShowAddModal(false);
      setNewContact({
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
      });

      fetchContacts();

    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add contact');
    }
  };

  // IMPORT
  const handleImport = async (contactsData) => {
    try {
      const response = await contactAPI.import({ contacts: contactsData });

      const importedCount =
        response.data.results.filter(r => r.status === 'imported').length;

      toast.success(`Imported ${importedCount} contacts`);

      fetchContacts();
      setShowImportModal(false);

    } catch {
      toast.error('Import failed');
    }
  };

  // EXPORT
  const exportContacts = () => {
    if (contacts.length === 0) return;

    const csvData = contacts.map(contact => ({
      email: contact.email,
      firstName: contact.firstName,
      lastName: contact.lastName,
      phone: contact.phone
    }));

    const headers = Object.keys(csvData[0]);

    const csv = [
      headers.join(','),
      ...csvData.map(row =>
        headers.map(h => JSON.stringify(row[h] || '')).join(',')
      )
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'contacts.csv';
    a.click();

    window.URL.revokeObjectURL(url);

    toast.success('Exported successfully');
  };

  // LOADING
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-10 w-10 border-b-2 border-blue-600 rounded-full"></div>
      </div>
    );
  }

  return (
    <div>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Contacts</h1>
          <p className="text-gray-600">Manage your contacts</p>
        </div>

        <div className="flex space-x-3">

          <button
            onClick={exportContacts}
            disabled={contacts.length === 0}
            className="bg-gray-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Export
          </button>

          <button
            onClick={() => setShowImportModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Import
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <PlusIcon className="h-5 w-5" />
            Add Contact
          </button>

        </div>
      </div>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search contacts..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-4 p-2 border rounded"
      />

      {/* LIST */}
      {contacts.length > 0 ? (
        <ContactList contacts={contacts} onUpdate={fetchContacts} />
      ) : (
        <div className="text-center py-10">
          <UsersIcon className="mx-auto h-10 text-gray-400" />
          <p>No contacts</p>
        </div>
      )}

      {/* ADD CONTACT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-96">

            <h2 className="text-lg font-bold mb-4">Add Contact</h2>

            <input
              placeholder="First Name"
              value={newContact.firstName}
              onChange={(e) =>
                setNewContact({ ...newContact, firstName: e.target.value })
              }
              className="w-full mb-2 p-2 border"
            />

            <input
              placeholder="Last Name"
              value={newContact.lastName}
              onChange={(e) =>
                setNewContact({ ...newContact, lastName: e.target.value })
              }
              className="w-full mb-2 p-2 border"
            />

            <input
              placeholder="Email"
              value={newContact.email}
              onChange={(e) =>
                setNewContact({ ...newContact, email: e.target.value })
              }
              className="w-full mb-2 p-2 border"
            />

            <input
              placeholder="Phone"
              value={newContact.phone}
              onChange={(e) =>
                setNewContact({ ...newContact, phone: e.target.value })
              }
              className="w-full mb-4 p-2 border"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="bg-gray-400 px-3 py-1 text-white rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleAddContact}
                className="bg-blue-600 px-3 py-1 text-white rounded"
              >
                Add
              </button>
            </div>

          </div>
        </div>
      )}

      {/* IMPORT MODAL */}
      {showImportModal && (
        <ImportContacts
          onClose={() => setShowImportModal(false)}
          onImport={handleImport}
        />
      )}
    </div>
  );
};

export default Contacts;