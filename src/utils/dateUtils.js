/**
 * Format date to Indonesian locale
 * @param {Date|string} date - Date to format
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export const formatDate = (date, options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options
  };
  
  return new Intl.DateTimeFormat('id-ID', defaultOptions).format(new Date(date));
};

/**
 * Format time to Indonesian locale
 * @param {Date|string} date - Date to format time from
 * @returns {string} Formatted time string
 */
export const formatTime = (date = new Date()) => {
  return new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(new Date(date));
};

/**
 * Get greeting based on current time
 * @returns {string} Greeting message
 */
export const getGreeting = () => {
  const hour = new Date().getHours();
  
  if (hour < 12) return 'Selamat Pagi';
  if (hour < 15) return 'Selamat Siang';
  if (hour < 18) return 'Selamat Sore';
  return 'Selamat Malam';
};

/**
 * Calculate time difference
 * @param {Date|string} startDate - Start date
 * @param {Date|string} endDate - End date (default: now)
 * @returns {Object} Time difference object
 */
export const getTimeDifference = (startDate, endDate = new Date()) => {
  const diff = new Date(endDate) - new Date(startDate);
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  return { days, hours, minutes, seconds };
};