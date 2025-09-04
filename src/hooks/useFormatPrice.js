import { useMemo } from "react";

/**
 * Custom hook for formatting prices from cents to properly formatted dollar amounts
 * @param {number} cents - Price in cents (e.g., 1299 for $12.99)
 * @param {string} currency - Currency code (default: 'USD')
 * @param {string} locale - Locale for formatting (default: 'en-US')
 * @returns {object} Object containing formatted price and utility functions
 */
export const useFormatPrice = (cents, currency = "USD", locale = "en-US") => {
  const formattedPrice = useMemo(() => {
    if (cents === null || cents === undefined || isNaN(cents)) {
      return {
        formatted: "$0.00",
        dollars: 0,
        cents: 0,
        raw: 0,
      };
    }

    const dollars = cents / 100;
    
    const formatted = new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(dollars);

    return {
      formatted, // "$12.99"
      dollars: Math.floor(cents / 100), // 12
      cents: cents % 100, // 99
      raw: dollars, // 12.99
    };
  }, [cents, currency, locale]);

  return formattedPrice;
};

/**
 * Utility function to convert dollars to cents
 * @param {number} dollars - Amount in dollars
 * @returns {number} Amount in cents
 */
export const dollarsToCents = (dollars) => {
  if (dollars === null || dollars === undefined || isNaN(dollars)) {
    return 0;
  }
  return Math.round(dollars * 100);
};

/**
 * Utility function to convert cents to dollars
 * @param {number} cents - Amount in cents
 * @returns {number} Amount in dollars
 */
export const centsToDollars = (cents) => {
  if (cents === null || cents === undefined || isNaN(cents)) {
    return 0;
  }
  return cents / 100;
};
