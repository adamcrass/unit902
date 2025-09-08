// src/config/admin.js
export const adminSections = [
  { id: "products", label: "Products", category: "Inventory" },
  { id: "orders", label: "Orders", category: "Sales" },
  { id: "customers", label: "Customers", category: "Sales" },
  { id: "analytics", label: "Analytics", category: "Reports" },
  { id: "settings", label: "Settings", category: "System" },
];

export const adminTabs = [
  { id: "overview", label: "Overview" },
  { id: "add", label: "Add Product" },
  { id: "manage", label: "Manage Products" },
];

export const defaultActiveSection = "products";

// Product stats configuration
export const getProductStatsConfig = stats => [
  {
    id: "total-products",
    label: "Total Products",
    value: stats.totalProducts,
    change: "+2 this week",
    positive: true,
  },
  {
    id: "in-stock",
    label: "In Stock",
    value: stats.inStock,
    change: `${stats.totalProducts > 0 ? ((stats.inStock / stats.totalProducts) * 100).toFixed(0) : 0}% of inventory`,
    positive: stats.inStock > stats.outOfStock,
  },
  {
    id: "out-of-stock",
    label: "Out of Stock",
    value: stats.outOfStock,
    change: stats.outOfStock > 0 ? "Needs attention" : "All stocked",
    positive: false,
  },
  {
    id: "total-value",
    label: "Total Value",
    value: `$${(stats.totalValue / 100).toFixed(2)}`,
    change: "+12% this month",
    positive: true,
  },
];

// Future stats configs for other sections
export const getOrderStatsConfig = _stats => [
  // Will be implemented when orders section is created
];

export const getCustomerStatsConfig = _stats => [
  // Will be implemented when customers section is created
];
