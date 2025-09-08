// src/theme/colors.js
const colors = {
  // Core brand colors
  primary: "#0ea5e9", // Sky blue (CTA, links, buttons)
  primaryLight: "#9cb3ca", // Sky blue (CTA, links, buttons)
  secondary: "#64748b", // Slate gray (supporting accents)

  // Backgrounds
  background: "#f9fafb", // Light neutral background
  surface: "#ffffff", // Cards, panels, modal backgrounds

  // Text
  textPrimary: "#1e293b", // Dark blue-gray for readability
  textSecondary: "#475569", // Lighter for subtext or muted labels

  // Accent & UI States
  success: "#10b981", // Emerald green
  warning: "#facc15", // Yellow
  danger: "#ef4444", // Red
  info: "#3b82f6", // Blue for alerts/toasts
  primarySoft: "#e0f2fe", // Light blue for soft backgrounds
  surfaceHover: "#f8fafc", // Hover state for surface elements

  // Neutrals
  white: "#ffffff",
  black: "#000000",
  gray100: "#f1f5f9",
  gray200: "#e2e8f0",
  gray300: "#cbd5e1",
  gray400: "#94a3b8",
  gray500: "#64748b",
  gray600: "#475569",
  gray700: "#334155",

  // Border / shadows
  border: "#e2e8f0",
  shadow: "rgba(0, 0, 0, 0.05)",
  whiteShadowDark: "rgba(255, 255, 255, 0.8)",
  whiteShadowLight: "rgba(255, 255, 255, 0.1)",

  // Transparent overlays - consolidated to 3 meaningful variations
  whiteOverlayLight: "rgba(255, 255, 255, 0.1)",   // 10% - subtle backgrounds
  whiteOverlayMedium: "rgba(255, 255, 255, 0.2)",  // 20% - hover/active states
  whiteOverlayStrong: "rgba(255, 255, 255, 0.8)",  // 80% - text on dark backgrounds
  
  // Focus and hover states
  primaryFocus: "rgba(14, 165, 233, 0.25)", // primary with 40 hex = 25% opacity
  dangerHover10: "rgba(239, 68, 68, 0.1)",
  
  // Dropdown shadows
  dropdownShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
};

export default colors;
