import React, { useState, forwardRef } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { X, AlertCircle, CheckCircle } from "lucide-react";

// Size configurations
const sizeConfig = {
  sm: {
    padding: "8px 12px",
    fontSize: "14px",
    height: "36px",
    iconSize: 16,
    labelFontSize: "11px",
  },
  md: {
    padding: "12px 16px",
    fontSize: "16px",
    height: "48px",
    iconSize: 20,
    labelFontSize: "12px",
  },
  lg: {
    padding: "16px 20px",
    fontSize: "18px",
    height: "56px",
    iconSize: 24,
    labelFontSize: "14px",
  },
  full: {
    padding: "12px 16px",
    fontSize: "16px",
    height: "48px",
    iconSize: 20,
    labelFontSize: "12px",
  },
};

// Container wrapper
const InputContainer = styled.div`
  position: relative;
  width: ${props => (props.size === "full" ? "100%" : "auto")};
  ${props =>
    props.size !== "full" &&
    css`
      max-width: ${props.size === "sm"
        ? "200px"
        : props.size === "md"
          ? "300px"
          : "400px"};
    `}
`;

// Main input wrapper
const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

// Styled input element
const StyledInput = styled.input`
  width: 100%;
  height: ${props => sizeConfig[props.size].height};
  padding: ${props => {
    const config = sizeConfig[props.size];
    const leftPadding = props.hasLeftIcon
      ? `${parseInt(config.padding.split(" ")[1]) + config.iconSize + 8}px`
      : config.padding.split(" ")[1];
    const rightPadding = props.hasRightIcon
      ? `${parseInt(config.padding.split(" ")[1]) + config.iconSize + 8}px`
      : config.padding.split(" ")[1];
    return `${config.padding.split(" ")[0]} ${rightPadding} ${config.padding.split(" ")[0]} ${leftPadding}`;
  }};
  font-size: ${props => sizeConfig[props.size].fontSize};
  color: #2d3748;
  background: ${props => {
    if (props.error) return "rgba(239, 68, 68, 0.05)";
    if (props.success) return "rgba(34, 197, 94, 0.05)";
    return "#ffffff";
  }};
  border: 1.5px solid
    ${props => {
      if (props.error) return "rgba(239, 68, 68, 0.4)";
      if (props.success) return "rgba(34, 197, 94, 0.4)";
      return "#e2e8f0";
    }};
  border-radius: 14px;
  outline: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  placeholder-color: rgba(255, 255, 255, 0.5);

  &::placeholder {
    color: transparent;
  }

  &:hover {
    background: ${props => {
      if (props.error) return "rgba(239, 68, 68, 0.08)";
      if (props.success) return "rgba(34, 197, 94, 0.08)";
      return "#f7fafc";
    }};
    border-color: ${props => {
      if (props.error) return "rgba(239, 68, 68, 0.5)";
      if (props.success) return "rgba(34, 197, 94, 0.5)";
      return "#cbd5e0";
    }};
    transform: translateY(-1px);
  }

  &:focus {
    background: ${props => {
      if (props.error) return "rgba(239, 68, 68, 0.08)";
      if (props.success) return "rgba(34, 197, 94, 0.08)";
      return "#ffffff";
    }};
    border-color: ${props => {
      if (props.error) return "rgba(239, 68, 68, 0.6)";
      if (props.success) return "rgba(34, 197, 94, 0.6)";
      return "#667eea";
    }};
    box-shadow: ${props => {
      if (props.error) return "0 0 0 3px rgba(239, 68, 68, 0.1), 0 4px 12px rgba(0, 0, 0, 0.05)";
      if (props.success) return "0 0 0 3px rgba(34, 197, 94, 0.1), 0 4px 12px rgba(0, 0, 0, 0.05)";
      return "0 0 0 3px rgba(102, 126, 234, 0.1), 0 4px 12px rgba(0, 0, 0, 0.05)";
    }};
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.1);
  }
`;

// Floating label
const FloatingLabel = styled.label`
  position: absolute;
  left: ${props => {
    const config = sizeConfig[props.size];
    return props.hasLeftIcon
      ? `${parseInt(config.padding.split(" ")[1]) + config.iconSize + 8}px`
      : config.padding.split(" ")[1];
  }};
  top: ${props => (props.isFloating ? "2px" : "50%")};
  transform: translateY(${props => (props.isFloating ? "0" : "-50%")});
  font-size: ${props =>
    props.isFloating
      ? sizeConfig[props.size].labelFontSize
      : sizeConfig[props.size].fontSize};
  color: ${props => {
    if (props.error) return "rgba(239, 68, 68, 0.9)";
    if (props.success) return "rgba(34, 197, 94, 0.9)";
    if (props.isFloating) return "#4a5568";
    return "#718096";
  }};
  font-weight: ${props => (props.isFloating ? "500" : "400")};
  pointer-events: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1;
`;

// Icon wrapper
const IconWrapper = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${props =>
    props.position === "left"
      ? css`
          left: ${sizeConfig[props.size].padding.split(" ")[1]};
        `
      : css`
          right: ${sizeConfig[props.size].padding.split(" ")[1]};
        `}
  color: ${props => {
    if (props.error) return "rgba(239, 68, 68, 0.8)";
    if (props.success) return "rgba(34, 197, 94, 0.8)";
    return "#718096";
  }};
  transition: color 0.3s ease;
  z-index: 2;
  cursor: ${props => (props.clickable ? "pointer" : "default")};

  &:hover {
    color: ${props =>
      props.clickable ? "#4a5568" : "inherit"};
  }
`;

// Message line
const MessageLine = styled.div`
  margin-top: 6px;
  font-size: ${props => sizeConfig[props.size].labelFontSize};
  color: ${props => {
    if (props.error) return "rgba(239, 68, 68, 0.9)";
    if (props.success) return "rgba(34, 197, 94, 0.9)";
    return "rgba(255, 255, 255, 0.7)";
  }};
  display: flex;
  align-items: center;
  gap: 4px;
  min-height: 18px;
`;

// Clear button
const ClearButton = styled.button`
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;

  &:hover {
    color: rgba(255, 255, 255, 0.9);
  }
`;

const Input = forwardRef(
  (
    {
      label,
      icon,
      iconPosition = "left",
      size = "md",
      clearable = false,
      message,
      error = false,
      success = false,
      disabled = false,
      value = "",
      onChange,
      onClear,
      className,
      ...props
    },
    ref
  ) => {
    const [focused, setFocused] = useState(false);
    const [internalValue, setInternalValue] = useState(value);

    const currentValue = value !== undefined ? value : internalValue;
    const isFloating = focused || currentValue.length > 0;

    const hasLeftIcon = icon && iconPosition === "left";
    const hasRightIcon = (icon && iconPosition === "right") || clearable;

    const handleChange = e => {
      const newValue = e.target.value;
      if (value === undefined) {
        setInternalValue(newValue);
      }
      onChange?.(e);
    };

    const handleClear = () => {
      if (value === undefined) {
        setInternalValue("");
      }
      onClear?.();
    };

    const getStatusIcon = () => {
      if (error) return <AlertCircle size={sizeConfig[size].iconSize} />;
      if (success) return <CheckCircle size={sizeConfig[size].iconSize} />;
      return null;
    };

    const renderRightIcon = () => {
      if (clearable && currentValue.length > 0) {
        return (
          <ClearButton onClick={handleClear} type="button">
            <X size={sizeConfig[size].iconSize} />
          </ClearButton>
        );
      }
      if (icon && iconPosition === "right") {
        return React.cloneElement(icon, { size: sizeConfig[size].iconSize });
      }
      return null;
    };

    return (
      <InputContainer size={size} className={className}>
        <InputWrapper>
          {hasLeftIcon && (
            <IconWrapper
              position="left"
              size={size}
              error={error}
              success={success}
            >
              {React.cloneElement(icon, { size: sizeConfig[size].iconSize })}
            </IconWrapper>
          )}

          <StyledInput
            ref={ref}
            size={size}
            hasLeftIcon={hasLeftIcon}
            hasRightIcon={hasRightIcon}
            error={error}
            success={success}
            disabled={disabled}
            value={currentValue}
            onChange={handleChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            {...props}
          />

          {label && (
            <FloatingLabel
              size={size}
              hasLeftIcon={hasLeftIcon}
              isFloating={isFloating}
              error={error}
              success={success}
            >
              {label}
            </FloatingLabel>
          )}

          {hasRightIcon && (
            <IconWrapper
              position="right"
              size={size}
              error={error}
              success={success}
              clickable={clearable && currentValue.length > 0}
            >
              {renderRightIcon()}
            </IconWrapper>
          )}
        </InputWrapper>

        {(message || error || success) && (
          <MessageLine size={size} error={error} success={success}>
            {getStatusIcon()}
            {message}
          </MessageLine>
        )}
      </InputContainer>
    );
  }
);

Input.displayName = "Input";

export default Input;
