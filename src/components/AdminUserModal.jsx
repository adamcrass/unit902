import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { X, User, Mail, Lock, Shield, AlertCircle } from "lucide-react";
import { USER_ROLES, USER_STATUS } from "../services/userService";
import { getEditableRoles } from "../utils/roleUtils";
import { useScrollLock } from "../utils/scrollLock";
import { useModalRegistration } from "../contexts/GlobalModalContext";

// ============================================================================
// Styled Components
// ============================================================================

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 12px;
  animation: fadeIn 0.2s ease-out;
  /* Ensure modal fits in viewport on mobile */
  padding-top: max(12px, env(safe-area-inset-top));
  padding-bottom: max(12px, env(safe-area-inset-bottom));
  padding-left: max(12px, env(safe-area-inset-left));
  padding-right: max(12px, env(safe-area-inset-right));

  @media (min-width: 768px) {
    padding: 16px;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const Modal = styled.div`
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 480px;
  /* Mobile: Ensure modal fits in viewport with safe margins */
  max-height: calc(100vh - 24px);
  max-height: calc(100dvh - 24px); /* Use dynamic viewport height */
  overflow: hidden;
  box-shadow:
    0 25px 50px -12px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(0, 0, 0, 0.05);
  animation: slideIn 0.3s ease-out;
  display: flex;
  flex-direction: column;

  /* Tablet */
  @media (min-width: 768px) {
    max-width: 600px;
    max-height: calc(100vh - 32px);
    max-height: calc(100dvh - 32px);
    border-radius: 16px;
  }

  /* Desktop */
  @media (min-width: 1024px) {
    max-width: 800px;
    max-height: 90vh;
    max-height: 90dvh;
  }

  /* Large Desktop */
  @media (min-width: 1280px) {
    max-width: 900px;
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-20px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-bottom: 1px solid #e2e8f0;

  @media (min-width: 768px) {
    padding: 18px 24px;
  }

  @media (min-width: 1024px) {
    padding: 20px 28px;
  }
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;

  @media (min-width: 768px) {
    font-size: 24px;
    gap: 14px;
  }

  @media (min-width: 1024px) {
    font-size: 28px;
    gap: 16px;
  }

  svg {
    color: #3b82f6;
    width: 20px;
    height: 20px;

    @media (min-width: 768px) {
      width: 24px;
      height: 24px;
    }

    @media (min-width: 1024px) {
      width: 28px;
      height: 28px;
    }
  }
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  cursor: pointer;
  color: #64748b;
  transition: all 0.2s ease;

  @media (min-width: 1024px) {
    width: 44px;
    height: 44px;
  }

  svg {
    width: 20px;
    height: 20px;
  }

  &:hover {
    background: rgba(255, 255, 255, 1);
    color: #334155;
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const Form = styled.form`
  flex: 1;
  padding: 16px 20px;
  overflow-y: auto;
  /* Mobile: Account for header height and safe areas */
  max-height: calc(100dvh - 120px);

  @media (min-width: 768px) {
    padding: 20px 24px;
    max-height: calc(100dvh - 140px);
  }

  @media (min-width: 1024px) {
    padding: 24px 28px;
    max-height: calc(90dvh - 160px);
  }

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f5f9;
  }

  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
`;

const FormGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (min-width: 768px) {
    gap: 18px;
  }

  @media (min-width: 1024px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    align-items: start;
  }

  @media (min-width: 1280px) {
    gap: 24px;
  }
`;

const FormColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (min-width: 768px) {
    gap: 18px;
  }

  @media (min-width: 1024px) {
    gap: 16px;
  }
`;

const FullWidthSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (min-width: 768px) {
    gap: 18px;
  }

  @media (min-width: 1024px) {
    grid-column: 1 / -1;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }

  @media (min-width: 1280px) {
    gap: 24px;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 90px;

  @media (min-width: 768px) {
    min-height: 95px;
  }

  @media (min-width: 1024px) {
    min-height: 100px;
  }
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 6px;
  letter-spacing: -0.01em;

  @media (min-width: 768px) {
    font-size: 15px;
    margin-bottom: 7px;
  }

  @media (min-width: 1024px) {
    font-size: 15px;
    margin-bottom: 8px;
  }
`;

const InputContainer = styled.div`
  position: relative;
  margin-bottom: 6px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 14px 12px ${props => (props.$hasIcon ? "42px" : "14px")};
  border: 2px solid ${props => (props.$error ? "#ef4444" : "#e2e8f0")};
  border-radius: 10px;
  font-size: 14px;
  background: ${props => (props.disabled ? "#f8fafc" : "white")};
  box-sizing: border-box;
  transition: all 0.2s ease;

  @media (min-width: 768px) {
    padding: 13px 16px 13px ${props => (props.$hasIcon ? "45px" : "16px")};
    font-size: 15px;
  }

  @media (min-width: 1024px) {
    padding: 14px 18px 14px ${props => (props.$hasIcon ? "48px" : "18px")};
  }

  &:focus {
    outline: none;
    border-color: ${props => (props.$error ? "#ef4444" : "#3b82f6")};
    box-shadow: 0 0 0 3px
      ${props =>
        props.$error ? "rgba(239, 68, 68, 0.12)" : "rgba(59, 130, 246, 0.12)"};
    background: white;

    @media (min-width: 1024px) {
      box-shadow: 0 0 0 4px
        ${props =>
          props.$error
            ? "rgba(239, 68, 68, 0.12)"
            : "rgba(59, 130, 246, 0.12)"};
    }
  }

  &:disabled {
    background: #f8fafc;
    color: #64748b;
    cursor: not-allowed;
    border-color: #e2e8f0;
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px 14px;
  border: 2px solid ${props => (props.$error ? "#ef4444" : "#e2e8f0")};
  border-radius: 10px;
  font-size: 14px;
  background: white;
  box-sizing: border-box;
  transition: all 0.2s ease;
  cursor: pointer;
  margin-bottom: 6px;

  @media (min-width: 768px) {
    padding: 13px 16px;
    font-size: 15px;
  }

  @media (min-width: 1024px) {
    padding: 14px 18px;
  }

  &:focus {
    outline: none;
    border-color: ${props => (props.$error ? "#ef4444" : "#3b82f6")};
    box-shadow: 0 0 0 3px
      ${props =>
        props.$error ? "rgba(239, 68, 68, 0.12)" : "rgba(59, 130, 246, 0.12)"};

    @media (min-width: 1024px) {
      box-shadow: 0 0 0 4px
        ${props =>
          props.$error
            ? "rgba(239, 68, 68, 0.12)"
            : "rgba(59, 130, 246, 0.12)"};
    }
  }

  &:hover {
    border-color: ${props => (props.$error ? "#ef4444" : "#cbd5e1")};
  }
`;

const InputIcon = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
  transition: color 0.2s ease;

  @media (min-width: 768px) {
    left: 14px;
  }

  @media (min-width: 1024px) {
    left: 16px;
  }

  svg {
    width: 16px;
    height: 16px;

    @media (min-width: 1024px) {
      width: 18px;
      height: 18px;
    }
  }

  ${InputContainer}:focus-within & {
    color: #3b82f6;
  }
`;

const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #ef4444;
  font-weight: 500;

  svg {
    flex-shrink: 0;
    width: 16px;
    height: 16px;
  }
`;

const HelpText = styled.div`
  font-size: 12px;
  color: #64748b;
  line-height: 1.4;
  margin-top: 3px;

  @media (min-width: 768px) {
    font-size: 13px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 2px solid #f1f5f9;

  @media (min-width: 480px) {
    flex-direction: row;
  }

  @media (min-width: 768px) {
    gap: 12px;
    margin-top: 24px;
    padding-top: 20px;
  }

  @media (min-width: 1024px) {
    gap: 16px;
    margin-top: 28px;
  }
`;

const Button = styled.button`
  padding: 12px 20px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid transparent;
  min-width: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  @media (min-width: 768px) {
    padding: 13px 24px;
    font-size: 15px;
    min-width: 120px;
  }

  @media (min-width: 1024px) {
    padding: 14px 28px;
    min-width: 140px;
    gap: 8px;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  &:active:not(:disabled) {
    transform: translateY(1px);
  }
`;

const CancelButton = styled(Button)`
  background: white;
  color: #475569;
  border-color: #e2e8f0;

  &:hover:not(:disabled) {
    background: #f8fafc;
    border-color: #cbd5e1;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const SaveButton = styled(Button)`
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
  }
`;

const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

// ============================================================================
// Main Component
// ============================================================================

const UserModal = ({
  user,
  onSave,
  onClose,
  currentUserRole,
  currentUserId,
}) => {
  // Lock body scrolling when modal is open
  useScrollLock(true);

  // Register modal with global context to hide mobile menu
  useModalRegistration("user-modal", true);

  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    password: "",
    confirmPassword: "",
    jobTitle: "",
    role: USER_ROLES.USER,
    status: USER_STATUS.ACTIVE,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const isEditing = !!user;

  // Get available roles based on current user permissions
  const availableRoles = getEditableRoles(
    currentUserRole,
    user?.id,
    currentUserId
  );

  useEffect(() => {
    if (user) {
      setFormData({
        displayName: user.displayName || "",
        email: user.email || "",
        password: "",
        confirmPassword: "",
        jobTitle: user.jobTitle || "",
        role: user.role || USER_ROLES.USER,
        status: user.status || USER_STATUS.ACTIVE,
      });
    }
  }, [user]);

  const validateForm = () => {
    const newErrors = {};

    // Display name validation
    if (!formData.displayName.trim()) {
      newErrors.displayName = "Display name is required";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation (only for new users)
    if (!isEditing) {
      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const userData = {
        displayName: formData.displayName.trim(),
        email: formData.email.trim(),
        jobTitle: formData.jobTitle.trim(),
        role: formData.role,
        status: formData.status,
      };

      // Only include password for new users
      if (!isEditing) {
        userData.password = formData.password;
      }

      await onSave(userData);
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleOverlayClick = e => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <Overlay onClick={handleOverlayClick}>
      <Modal>
        <Header>
          <Title>
            <User />
            {isEditing ? "Edit User" : "Add New User"}
          </Title>
          <CloseButton onClick={onClose}>
            <X />
          </CloseButton>
        </Header>

        <Form onSubmit={handleSubmit}>
          <FormGrid>
            {/* Email Address - Full Width */}
            <FullWidthSection>
              <FormGroup>
                <FormField>
                  <Label htmlFor="email">Email Address *</Label>
                  <InputContainer>
                    <InputIcon>
                      <Mail />
                    </InputIcon>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={e => handleInputChange("email", e.target.value)}
                      $hasIcon
                      $error={errors.email}
                      placeholder="Enter email address"
                      disabled={isEditing}
                    />
                  </InputContainer>
                  {errors.email && (
                    <ErrorMessage>
                      <AlertCircle />
                      {errors.email}
                    </ErrorMessage>
                  )}
                  {isEditing && (
                    <HelpText>
                      Email cannot be changed for existing users
                    </HelpText>
                  )}
                </FormField>
              </FormGroup>
            </FullWidthSection>

            {/* Left Column - Personal Information */}
            <FormColumn>
              <FormGroup>
                <FormField>
                  <Label htmlFor="displayName">Display Name *</Label>
                  <InputContainer>
                    <InputIcon>
                      <User />
                    </InputIcon>
                    <Input
                      id="displayName"
                      type="text"
                      value={formData.displayName}
                      onChange={e =>
                        handleInputChange("displayName", e.target.value)
                      }
                      $hasIcon
                      $error={errors.displayName}
                      placeholder="Enter full name"
                    />
                  </InputContainer>
                  {errors.displayName && (
                    <ErrorMessage>
                      <AlertCircle />
                      {errors.displayName}
                    </ErrorMessage>
                  )}
                </FormField>
              </FormGroup>

              <FormGroup>
                <FormField>
                  <Label htmlFor="jobTitle">Job Title</Label>
                  <InputContainer>
                    <InputIcon>
                      <Shield />
                    </InputIcon>
                    <Input
                      id="jobTitle"
                      type="text"
                      value={formData.jobTitle}
                      onChange={e =>
                        handleInputChange("jobTitle", e.target.value)
                      }
                      $hasIcon
                      $error={errors.jobTitle}
                      placeholder="Enter job title (e.g., Manager, Server, Chef)"
                    />
                  </InputContainer>
                  {errors.jobTitle && (
                    <ErrorMessage>
                      <AlertCircle />
                      {errors.jobTitle}
                    </ErrorMessage>
                  )}
                  <HelpText>User position in the organization</HelpText>
                </FormField>
              </FormGroup>
            </FormColumn>

            {/* Right Column - Account Settings */}
            <FormColumn>
              <FormGroup>
                <FormField>
                  <Label htmlFor="role">Role</Label>
                  <Select
                    id="role"
                    value={formData.role}
                    onChange={e => handleInputChange("role", e.target.value)}
                    $error={errors.role}
                  >
                    {availableRoles.map(role => (
                      <option key={role} value={role}>
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </option>
                    ))}
                  </Select>
                  <HelpText>
                    Determines user permissions and access level
                  </HelpText>
                </FormField>
              </FormGroup>

              <FormGroup>
                <FormField>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    id="status"
                    value={formData.status}
                    onChange={e => handleInputChange("status", e.target.value)}
                    $error={errors.status}
                  >
                    {Object.values(USER_STATUS).map(status => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </Select>
                  <HelpText>
                    Active users can log in, inactive users cannot
                  </HelpText>
                </FormField>
              </FormGroup>
            </FormColumn>

            {/* Password fields - only show when creating new users */}
            {!isEditing && (
              <FullWidthSection>
                <FormGroup>
                  <FormField>
                    <Label htmlFor="password">Password *</Label>
                    <InputContainer>
                      <InputIcon>
                        <Lock />
                      </InputIcon>
                      <Input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={e =>
                          handleInputChange("password", e.target.value)
                        }
                        $hasIcon
                        $error={errors.password}
                        placeholder="Enter password"
                      />
                    </InputContainer>
                    {errors.password && (
                      <ErrorMessage>
                        <AlertCircle />
                        {errors.password}
                      </ErrorMessage>
                    )}
                    <HelpText>Password must be at least 6 characters</HelpText>
                  </FormField>
                </FormGroup>

                <FormGroup>
                  <FormField>
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <InputContainer>
                      <InputIcon>
                        <Lock />
                      </InputIcon>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={e =>
                          handleInputChange("confirmPassword", e.target.value)
                        }
                        $hasIcon
                        $error={errors.confirmPassword}
                        placeholder="Confirm password"
                      />
                    </InputContainer>
                    {errors.confirmPassword && (
                      <ErrorMessage>
                        <AlertCircle />
                        {errors.confirmPassword}
                      </ErrorMessage>
                    )}
                  </FormField>
                </FormGroup>
              </FullWidthSection>
            )}
          </FormGrid>

          {errors.submit && (
            <ErrorMessage style={{ marginTop: "24px" }}>
              <AlertCircle />
              {errors.submit}
            </ErrorMessage>
          )}

          <ButtonGroup>
            <CancelButton type="button" onClick={onClose} disabled={loading}>
              Cancel
            </CancelButton>
            <SaveButton type="submit" disabled={loading}>
              {loading ? (
                <>
                  <LoadingSpinner />
                  {isEditing ? "Updating..." : "Creating..."}
                </>
              ) : isEditing ? (
                "Update User"
              ) : (
                "Create User"
              )}
            </SaveButton>
          </ButtonGroup>
        </Form>
      </Modal>
    </Overlay>
  );
};

export default UserModal;
