// src/components/AdminStatsGrid.jsx
import React from "react";
import styled from "@emotion/styled";

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px ${({ theme }) => theme.colors.shadow};
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 0.5rem;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const StatChange = styled.div`
  font-size: 0.875rem;
  color: ${({ positive, theme }) => positive ? theme.colors.success : theme.colors.danger};
  margin-top: 0.25rem;
`;

const AdminStatsGrid = ({ stats }) => {
  return (
    <StatsGrid>
      {stats.map((stat, index) => (
        <StatCard key={stat.id || index}>
          <StatLabel>{stat.label}</StatLabel>
          <StatValue>{stat.value}</StatValue>
          {stat.change && (
            <StatChange positive={stat.positive}>
              {stat.change}
            </StatChange>
          )}
        </StatCard>
      ))}
    </StatsGrid>
  );
};

export default AdminStatsGrid;
