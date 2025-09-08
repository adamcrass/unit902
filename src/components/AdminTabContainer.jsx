// src/components/AdminTabContainer.jsx
import React, { useState } from "react";
import styled from "@emotion/styled";
import { adminTabs } from "../config/admin";

const TabContainer = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  margin-bottom: 2rem;
`;

const TabList = styled.div`
  display: flex;
  gap: 0;
`;

const Tab = styled.button`
  padding: 1rem 1.5rem;
  border: none;
  background: transparent;
  color: ${({ active, theme }) =>
    active ? theme.colors.primary : theme.colors.textSecondary};
  font-weight: ${({ active }) => (active ? "600" : "400")};
  font-size: 1rem;
  cursor: pointer;
  border-bottom: 2px solid
    ${({ active, theme }) => (active ? theme.colors.primary : "transparent")};
  transition: all 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.surfaceHover};
  }
`;

const TabContent = styled.div`
  animation: fadeIn 0.2s ease-in;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const AdminTabContainer = ({ defaultTab, children }) => {
  const [activeTab, setActiveTab] = useState(defaultTab || adminTabs[0]?.id);

  const renderTabContent = () => {
    if (typeof children === "function") {
      return children(activeTab);
    }
    return children;
  };

  return (
    <>
      <TabContainer>
        <TabList>
          {adminTabs.map(tab => (
            <Tab
              key={tab.id}
              active={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </Tab>
          ))}
        </TabList>
      </TabContainer>

      <TabContent>{renderTabContent()}</TabContent>
    </>
  );
};

export default AdminTabContainer;
