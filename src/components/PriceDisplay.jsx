import { useFormatPrice } from "../hooks/useFormatPrice";

/**
 * Component for displaying formatted prices
 * @param {number} cents - Price in cents
 * @param {string} currency - Currency code (optional)
 * @param {string} locale - Locale for formatting (optional)
 * @param {string} className - Additional CSS classes (optional)
 */
export const PriceDisplay = ({ 
  cents, 
  currency = "USD", 
  locale = "en-US", 
  className = "" 
}) => {
  const price = useFormatPrice(cents, currency, locale);

  return (
    <span className={`price-display ${className}`}>
      {price.formatted}
    </span>
  );
};

/**
 * Example usage component showing different price scenarios
 */
export const PriceExamples = () => {
  const examples = [
    { label: "Regular price", cents: 1299 },
    { label: "Sale price", cents: 999 },
    { label: "Premium item", cents: 4999 },
    { label: "Free item", cents: 0 },
    { label: "Large amount", cents: 123456 },
  ];

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2>Price Formatting Examples</h2>
      {examples.map((example, index) => {
        const price = useFormatPrice(example.cents);
        return (
          <div key={index} style={{ marginBottom: "10px" }}>
            <strong>{example.label}:</strong>
            <br />
            <span>Formatted: {price.formatted}</span>
            <br />
            <span>Dollars: {price.dollars}, Cents: {price.cents}</span>
            <br />
            <span>Raw: ${price.raw}</span>
            <hr />
          </div>
        );
      })}
    </div>
  );
};
