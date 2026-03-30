export const CAMPAIGN_TYPES = [
  { value: 'email', label: 'Email Marketing', icon: 'MailIcon' },
  { value: 'sms', label: 'SMS Marketing', icon: 'ChatIcon' },
  { value: 'push', label: 'Push Notification', icon: 'BellIcon' },
  { value: 'social', label: 'Social Media', icon: 'ShareIcon' }
];

export const CAMPAIGN_STATUS = {
  DRAFT: 'draft',
  SCHEDULED: 'scheduled',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  PAUSED: 'paused'
};

export const FREQUENCY_OPTIONS = [
  { value: 'once', label: 'Once' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' }
];

export const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' }
];

export const CONTACT_STATUS = {
  ACTIVE: 'active',
  UNSUBSCRIBED: 'unsubscribed',
  BOUNCED: 'bounced'
};

export const getStatusColor = (status) => {
  const colors = {
    active: 'green',
    scheduled: 'yellow',
    completed: 'blue',
    draft: 'gray',
    paused: 'red',
    unsubscribed: 'red',
    bounced: 'orange'
  };
  return colors[status] || 'gray';
};