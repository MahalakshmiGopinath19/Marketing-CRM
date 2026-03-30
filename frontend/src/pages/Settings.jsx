import React, { useState, useEffect } from 'react';

const Settings = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [notifications, setNotifications] = useState(true);

  useEffect(() => {
    const loadSettings = () => {
      const saved = localStorage.getItem('settings');

      if (saved) {
        const data = JSON.parse(saved);
        setName(data.name || '');
        setEmail(data.email || '');
        setNotifications(data.notifications ?? true);
      }
    };

    loadSettings();
  }, []);

  // Save data
  const handleSave = () => {
    const data = {
      name,
      email,
      notifications,
    };

    localStorage.setItem('settings', JSON.stringify(data));

    alert('Saved successfully');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow max-w-xl">
      <h1 className="text-xl font-bold mb-4">Settings</h1>

      {/* Name */}
      <div className="mb-3">
        <label className="block text-sm mb-1">Name</label>
        <input
          type="text"
          className="w-full border p-2 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      {/* Email */}
      <div className="mb-3">
        <label className="block text-sm mb-1">Email</label>
        <input
          type="email"
          className="w-full border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      {/* Notifications */}
      <div className="flex items-center justify-between mb-4">
        <span>Email Notifications</span>
        <input
          type="checkbox"
          checked={notifications}
          onChange={() => setNotifications(!notifications)}
        />
      </div>

      {/* Save */}
      <button
        onClick={handleSave}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Save
      </button>
    </div>
  );
};

export default Settings;