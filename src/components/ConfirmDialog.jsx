import React from "react";
import styled from "@emotion/styled";
import { AlertTriangle } from "lucide-react";
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
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const Dialog = styled.div`
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 24px 24px 16px 24px;
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${props => (props.danger ? "#fee2e2" : "#dbeafe")};
  color: ${props => (props.danger ? "#dc2626" : "#2563eb")};
  flex-shrink: 0;
`;

const Content = styled.div`
  flex: 1;
`;

const Title = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 8px 0;
`;

const Message = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin: 0;
  line-height: 1.5;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding: 16px 24px 24px 24px;
`;

const Button = styled.button`
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const CancelButton = styled(Button)`
  background: white;
  color: #374151;
  border-color: #d1d5db;

  &:hover:not(:disabled) {
    background: #f9fafb;
  }
`;

const ConfirmButton = styled(Button)`
  background: ${props => (props.danger ? "#dc2626" : "#3b82f6")};
  color: white;

  &:hover:not(:disabled) {
    background: ${props => (props.danger ? "#b91c1c" : "#2563eb")};
  }
`;

// ============================================================================
// Main Component
// ============================================================================

const ConfirmDialog = ({
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  danger = false,
}) => {
  // Lock body scrolling when dialog is open
  useScrollLock(true);

  // Register modal with global context to hide mobile menu
  useModalRegistration("confirm-dialog", true);

  const handleOverlayClick = e => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  return (
    <Overlay onClick={handleOverlayClick}>
      <Dialog>
        <Header>
          <IconContainer danger={danger}>
            <AlertTriangle size={24} />
          </IconContainer>
          <Content>
            <Title>{title}</Title>
            <Message>{message}</Message>
          </Content>
        </Header>

        <ButtonGroup>
          <CancelButton onClick={onCancel}>{cancelText}</CancelButton>
          <ConfirmButton danger={danger} onClick={onConfirm}>
            {confirmText}
          </ConfirmButton>
        </ButtonGroup>
      </Dialog>
    </Overlay>
  );
};

export default ConfirmDialog;
