import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  HomeIcon, 
  EnvelopeIcon, 
  UsersIcon, 
  ChartBarIcon,
  TagIcon,
  CogIcon 
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', to: '/dashboard', icon: HomeIcon },
  { name: 'Campaigns', to: '/campaigns', icon: EnvelopeIcon },
  { name: 'Contacts', to: '/contacts', icon: UsersIcon },
  { name: 'Segments', to: '/segments', icon: TagIcon },
  { name: 'Analytics', to: '/analytics', icon: ChartBarIcon },
  { name: 'Settings', to: '/settings', icon: CogIcon }, // ✅ already correct
];

const Sidebar = () => {
  return (
    <div className="bg-gray-900 text-white w-64 space-y-6 py-7 px-2 h-full">
      <div className="flex items-center justify-center space-x-2 px-4">
        <EnvelopeIcon className="h-8 w-8" />
        <span className="text-2xl font-extrabold">Marketing CRM</span>
      </div>

      <nav className="space-y-2">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center space-x-2 py-2.5 px-4 rounded transition duration-200 ${
                isActive
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;