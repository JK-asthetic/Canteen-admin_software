import { format } from 'date-fns';

/**
 * Format a date using date-fns
 * @param {Date|string|number} date - The date to format
 * @param {string} formatStr - The format string (see date-fns documentation for options)
 * @returns {string} Formatted date string
 */
export const formatDate = (date, formatStr = 'MM/dd/yyyy') => {
  try {
    if (!date) return '';
    
    // If date is a string or number, convert to Date object
    const dateObj = typeof date === 'string' || typeof date === 'number' 
      ? new Date(date) 
      : date;
    
    // Check if date is valid
    if (isNaN(dateObj.getTime())) return '';
    
    // Replace uppercase 'D' with lowercase 'd' for day of month formatting
    // Replace uppercase 'YYYY' with lowercase 'yyyy' for year formatting
    // This is required by date-fns as per their Unicode Tokens guidelines
    let correctedFormat = formatStr.replace(/D/g, 'd');
    correctedFormat = correctedFormat.replace(/YYYY/g, 'yyyy');
    
    return format(dateObj, correctedFormat);
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

/**
 * Format a number as currency in Indian Rupees
 * @param {number|string} amount - The amount to format
 * @param {string} currencyCode - Currency code (default: 'INR')
 * @param {string} locale - Locale for formatting (default: 'en-IN')
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currencyCode = 'INR', locale = 'en-IN') => {
  try {
    // Convert to number if it's a string
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    
    // Check if amount is a valid number
    if (isNaN(numAmount)) return '₹0.00';
    
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numAmount);
  } catch (error) {
    console.error('Error formatting currency:', error);
    return '₹0.00';
  }
};

/**
 * Format a number with commas (Indian numbering system)
 * @param {number|string} number - The number to format
 * @param {number} decimals - Number of decimal places (default: 0)
 * @returns {string} Formatted number string
 */
export const formatNumber = (number, decimals = 0) => {
  try {
    // Convert to number if it's a string
    const num = typeof number === 'string' ? parseFloat(number) : number;
    
    // Check if number is valid
    if (isNaN(num)) return '0';
    
    return num.toLocaleString('en-IN', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  } catch (error) {
    console.error('Error formatting number:', error);
    return '0';
  }
};

/**
 * Format a percentage
 * @param {number|string} value - The value to format as percentage
 * @param {number} decimals - Number of decimal places (default: 1)
 * @returns {string} Formatted percentage string
 */
export const formatPercentage = (value, decimals = 1) => {
  try {
    // Convert to number if it's a string
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    
    // Check if value is valid
    if (isNaN(numValue)) return '0%';
    
    return `${numValue.toLocaleString('en-IN', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })}%`;
  } catch (error) {
    console.error('Error formatting percentage:', error);
    return '0%';
  }
};