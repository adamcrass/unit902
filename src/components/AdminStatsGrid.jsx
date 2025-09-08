// src/components/AdminStatsGrid.jsx
import React, { useMemo } from "react";
import styled from "@emotion/styled";
import { useAdminProduct } from "../contexts/AdminProductContext";
import { getProductStatsConfig } from "../config/admin";

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
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 0.5rem;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const StatChange = styled.div`
  font-size: 1rem;
  color: ${({ positive, theme }) =>
    positive ? theme.colors.success : theme.colors.danger};
  margin-top: 0.25rem;
`;

const AdminStatsGrid = () => {
  const { stats } = useAdminProduct();
  const statsData = useMemo(() => getProductStatsConfig(stats), [stats]);

  return (
    <StatsGrid>
      {statsData.map((stat, index) => (
        <StatCard key={stat.id || index}>
          <StatLabel>{stat.label}</StatLabel>
          <StatValue>{stat.value}</StatValue>
          {/* TODO: lets look into this */}
          {stat.change && (
            <StatChange positive={stat.positive}>{stat.change}</StatChange>
          )}
        </StatCard>
      ))}
    </StatsGrid>
  );
};

export default AdminStatsGrid;
