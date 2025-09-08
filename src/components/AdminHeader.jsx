// src/components/AdminHeader.jsx
import React from "react";
import styled from "@emotion/styled";
import AdminMobileMenu from "./AdminMobileMenu";

const Header = styled.header`
  background: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding: 1.5rem 2rem;
  box-shadow: 0 1px 3px ${({ theme }) => theme.colors.shadow};
  display: flex;
  align-items: center;
  justify-content: space-between;

  ${({ theme }) => theme.mediaQueries.md} {
    padding: 1rem;
  }
`;

const HeaderContent = styled.div`
  flex: 1;
`;

const MobileMenuWrapper = styled.div`
  ${({ theme }) => theme.mediaQueries.md} {
    display: none;
  }
`;

const Title = styled.h1`
  margin: 0;
  font-size: 2rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};

  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 1.5rem;
  }
`;

const Subtitle = styled.p`
  margin: 0.5rem 0 0 0;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 1rem;
`;

const AdminHeader = ({ title, subtitle }) => {
  return (
    <Header>
      <HeaderContent>
        <Title>{title}</Title>
        <Subtitle>{subtitle}</Subtitle>
      </HeaderContent>
      <MobileMenuWrapper>
        <AdminMobileMenu />
      </MobileMenuWrapper>
    </Header>
  );
};

export default AdminHeader;
