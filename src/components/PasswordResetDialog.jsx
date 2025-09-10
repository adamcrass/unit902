import React from "react";
import styled from "@emotion/styled";
import { Mail, AlertTriangle, Shield, X, Loader } from "lucide-react";

// Styled Components
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
`;

const Dialog = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow: hidden;
  animation: slideIn 0.2s ease-out;

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
  padding: 24px 24px 16px;
  border-bottom: 1px solid #f3f4f6;
  position: relative;
`;

const HeaderIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  color: white;
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 8px 0;
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin: 0;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  padding: 8px;
  border-radius: 8px;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #f3f4f6;
    color: #374151;
  }
`;

const Content = styled.div`
  padding: 24px;
`;

const UserInfo = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
`;

const UserDetails = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 14px;
`;

const UserMeta = styled.div`
  flex: 1;
`;

const UserName = styled.div`
  font-weight: 500;
  color: #111827;
  font-size: 14px;
`;

const UserEmail = styled.div`
  color: #6b7280;
  font-size: 13px;
`;

const UserRole = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: #dbeafe;
  color: #1e40af;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 500;
  text-transform: capitalize;
`;

const WarningBox = styled.div`
  background: #fef3cd;
  border: 1px solid #fbbf24;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 20px;
  display: flex;
  gap: 8px;
`;

const WarningText = styled.div`
  color: #92400e;
  font-size: 13px;
  line-height: 1.4;
`;

const Actions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

const Button = styled.button`
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-width: 120px;
  justify-content: center;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const CancelButton = styled(Button)`
  background: #f9fafb;
  border: 1px solid #d1d5db;
  color: #374151;

  &:hover:not(:disabled) {
    background: #f3f4f6;
    border-color: #9ca3af;
  }
`;

const ConfirmButton = styled(Button)`
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border: none;
  color: white;

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 6px rgba(59, 130, 246, 0.3);
  }
`;

const LoadingSpinner = styled.div`
  animation: spin 1s linear infinite;

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const getInitials = name => {
  if (!name) return "U";
  return name
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const PasswordResetDialog = ({
  user,
  onConfirm,
  onCancel,
  isLoading = false,
}) => {
  if (!user) return null;

  const handleOverlayClick = e => {
    if (e.target === e.currentTarget && !isLoading) {
      onCancel();
    }
  };

  return (
    <Overlay onClick={handleOverlayClick}>
      <Dialog>
        <Header>
          <CloseButton onClick={onCancel} disabled={isLoading}>
            <X size={20} />
          </CloseButton>

          <HeaderIcon>
            <Mail size={24} />
          </HeaderIcon>

          <Title>Reset Password</Title>
          <Subtitle>Send password reset email to user</Subtitle>
        </Header>

        <Content>
          <UserInfo>
            <UserDetails>
              <UserAvatar>{getInitials(user.displayName)}</UserAvatar>
              <UserMeta>
                <UserName>{user.displayName || "Unknown User"}</UserName>
                <UserEmail>{user.email}</UserEmail>
              </UserMeta>
              <UserRole>
                <Shield size={10} />
                {user.role || "user"}
              </UserRole>
            </UserDetails>
          </UserInfo>

          <WarningBox>
            <AlertTriangle size={16} color="#f59e0b" />
            <WarningText>
              <strong>
                This will send a password reset email to {user.email}
              </strong>
              <br />
              The user will receive an email with instructions to create a new
              password. This action cannot be undone.
            </WarningText>
          </WarningBox>

          <Actions>
            <CancelButton onClick={onCancel} disabled={isLoading}>
              Cancel
            </CancelButton>
            <ConfirmButton onClick={onConfirm} disabled={isLoading}>
              {isLoading ? (
                <>
                  <LoadingSpinner>
                    <Loader size={16} />
                  </LoadingSpinner>
                  Sending...
                </>
              ) : (
                <>
                  <Mail size={16} />
                  Send Reset Email
                </>
              )}
            </ConfirmButton>
          </Actions>
        </Content>
      </Dialog>
    </Overlay>
  );
};

export default PasswordResetDialog;
