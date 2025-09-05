// src/components/Button.jsx
import React from "react";
import styled from "@emotion/styled";

const StyledButton = styled.button`
  width: 100%;
  padding: 14px 24px;
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
  border-radius: 8px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 48px;

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

  @media (min-width: 480px) {
    padding: 12px 24px;
    font-size: 16px;
    gap: 12px;
  }
`;

const Button = ({
  children,
  variant = "default",
  isLoading,
  disabled,
  type = "button",
  ...props
}) => {
  return (
    <StyledButton
      type={type}
      variant={variant}
      disabled={disabled || isLoading}
      isLoading={isLoading}
      {...props}
    >
      {children}
    </StyledButton>
  );
};

export default Button;
