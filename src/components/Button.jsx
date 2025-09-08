// src/components/Button.jsx
import React from "react";
import styled from "@emotion/styled";

const getSizeStyles = size => {
  const sizes = {
    sm: {
      padding: "8px 16px",
      fontSize: "14px",
      minHeight: "36px",
      gap: "6px",
      borderRadius: "6px",
    },
    md: {
      padding: "12px 20px",
      fontSize: "15px",
      minHeight: "44px",
      gap: "8px",
      borderRadius: "8px",
    },
    lg: {
      padding: "14px 24px",
      fontSize: "16px",
      minHeight: "48px",
      gap: "10px",
      borderRadius: "8px",
    },
  };

  return sizes[size] || sizes.md;
};

const StyledButton = styled.button`
  width: 100%;
  ${({ size }) => {
    const sizeStyles = getSizeStyles(size);
    return `
      padding: ${sizeStyles.padding};
      font-size: ${sizeStyles.fontSize};
      min-height: ${sizeStyles.minHeight};
      gap: ${sizeStyles.gap};
      border-radius: ${sizeStyles.borderRadius};
    `;
  }}

  background: ${({ theme, variant }) => {
    if (variant === "primary") return theme.colors.primary;
    if (variant === "ghost") return "transparent";
    return theme.colors.surface;
  }};

  color: ${({ theme, variant }) => {
    if (variant === "primary") return theme.colors.white;
    if (variant === "ghost") return theme.colors.white;
    return theme.colors.textPrimary;
  }};

  border: 1px solid
    ${({ theme, variant }) => {
      if (variant === "primary") return theme.colors.primary;
      if (variant === "ghost") return "none";
      return theme.colors.border;
    }};

  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:active {
    transform: translateY(0);
    background: ${({ theme, variant }) => {
      if (variant === "primary")
        return theme.colors.primaryHover || theme.colors.primary;
      if (variant === "ghost")
        return theme.colors.gray50 || "rgba(0, 0, 0, 0.05)";
      return theme.colors.gray100;
    }};
  }

  /* Hover effects only on devices that support hover (desktop) */
  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background: ${({ theme, variant }) => {
        if (variant === "primary")
          return theme.colors.primaryHover || theme.colors.primary;
        if (variant === "ghost")
          return theme.colors.gray50 || "rgba(0, 0, 0, 0.05)";
        return theme.colors.gray100;
      }};
      border-color: ${({ theme, variant }) => {
        if (variant === "primary")
          return theme.colors.primaryHover || theme.colors.primary;
        if (variant === "ghost")
          return theme.colors.primary || theme.colors.border;
        return theme.colors.gray300;
      }};
      transform: translateY(-1px);
    }

    &:active {
      transform: translateY(0);
    }
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.gray100};
    color: ${({ theme }) => theme.colors.gray400};
    cursor: not-allowed;
    transform: none;
  }

  ${props =>
    props.isLoading &&
    `
    background: ${props.theme.colors.gray100};
    color: ${props.theme.colors.gray400};
    cursor: not-allowed;
  `}

  /* Responsive adjustments for mobile */
  @media (max-width: 479px) {
    ${({ size }) => {
      if (size === "sm") return "padding: 6px 12px; font-size: 13px;";
      if (size === "md") return "padding: 10px 16px; font-size: 14px;";
      if (size === "lg") return "padding: 12px 20px; font-size: 15px;";
      return "";
    }}
  }
`;

const Button = ({
  children,
  variant = "default",
  size = "md",
  isLoading,
  disabled,
  type = "button",
  ...props
}) => {
  return (
    <StyledButton
      type={type}
      variant={variant}
      size={size}
      disabled={disabled || isLoading}
      isLoading={isLoading}
      {...props}
    >
      {children}
    </StyledButton>
  );
};

export default Button;
