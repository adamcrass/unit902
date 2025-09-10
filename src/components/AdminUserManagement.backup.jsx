import React, { useState } from "react";
import styled from "@emotion/styled";
import {
  Pencil,
  Trash2,
  Plus,
  Search,
  Filter,
  MoreVertical,
  User,
  Mail,
  Calendar,
  Shield,
  Users,
  Activity,
  UserX,
} from "lucide-react";

// Styled Components
const Container = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background};
  padding: 2rem;
`;

const ContentWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const HeaderContent = styled.div`
  color: white;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  color: ${({ theme }) => theme.colors.primary};
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.1rem;
  margin: 0;
`;

const ActionButton = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  padding: 0.875rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatsCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
`;

const StatsContent = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const StatsIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props =>
    props.gradient || "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"};
  color: white;
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
`;

const StatsInfo = styled.div`
  flex: 1;
`;

const StatsLabel = styled.p`
  color: #6b7280;
  font-size: 0.9rem;
  margin: 0 0 0.25rem 0;
  font-weight: 500;
`;

const StatsValue = styled.p`
  color: #1f2937;
  font-size: 2.25rem;
  font-weight: 700;
  margin: 0;
`;

const MainCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const SearchSection = styled.div`
  padding: 2rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
`;

const SearchGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 1rem;
  align-items: end;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const InputWrapper = styled.div`
  position: relative;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 2px solid #e5e7eb;
  border-radius: 16px;
  font-size: 1rem;
  background: white;

  &:focus {
    outline: none;
    border-color: #4facfe;
    box-shadow: 0 0 0 3px rgba(79, 172, 254, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
`;

const FilterSelect = styled.select`
  padding: 1rem 1rem 1rem 3rem;
  border: 2px solid #e5e7eb;
  border-radius: 16px;
  font-size: 1rem;
  background: white;
  cursor: pointer;
  min-width: 180px;

  &:focus {
    outline: none;
    border-color: #4facfe;
    box-shadow: 0 0 0 3px rgba(79, 172, 254, 0.1);
  }
`;

const FilterIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  pointer-events: none;
`;

const TableContainer = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
`;

const TableHeader = styled.thead`
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
`;

const TableHeaderCell = styled.th`
  padding: 1.5rem 2rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.85rem;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);

  &:first-of-type {
    border-top-left-radius: 0;
  }

  &:last-of-type {
    border-top-right-radius: 0;
    text-align: right;
  }
`;

const TableBody = styled.tbody`
  background: white;
`;

const TableRow = styled.tr`
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);

  &:last-child {
    border-bottom: none;
  }
`;

const TableCell = styled.td`
  padding: 1.5rem 2rem;
  vertical-align: middle;

  &:last-child {
    text-align: right;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Avatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${props =>
    props.gradient || "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1rem;
  box-shadow: 0 4px 12px rgba(79, 172, 254, 0.3);
`;

const UserDetails = styled.div`
  flex: 1;
`;

const UserName = styled.div`
  font-weight: 600;
  color: #1f2937;
  font-size: 1rem;
  margin-bottom: 0.25rem;
`;

const UserEmail = styled.div`
  color: #6b7280;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: capitalize;
  background: ${props => {
    switch (props.type) {
      case "active":
        return "linear-gradient(135deg, #10b981 0%, #059669 100%)";
      case "suspended":
        return "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)";
      case "inactive":
        return "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)";
      case "admin":
        return "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)";
      case "manager":
        return "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)";
      default:
        return "linear-gradient(135deg, #6b7280 0%, #4b5563 100%)";
    }
  }};
  color: white;
  box-shadow: 0 2px 8px
    ${props => {
      switch (props.type) {
        case "active":
          return "rgba(16, 185, 129, 0.3)";
        case "suspended":
          return "rgba(245, 158, 11, 0.3)";
        case "inactive":
          return "rgba(239, 68, 68, 0.3)";
        case "admin":
          return "rgba(139, 92, 246, 0.3)";
        case "manager":
          return "rgba(59, 130, 246, 0.3)";
        default:
          return "rgba(107, 114, 128, 0.3)";
      }
    }};
`;

const DateInfo = styled.div`
  color: #6b7280;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ActionsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ActionIcon = styled.button`
  padding: 0.75rem;
  border: none;
  border-radius: 12px;
  background: transparent;
  color: #6b7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #6b7280;
`;

const EmptyIcon = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto 1rem;
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
`;

const EmptyTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 0.5rem 0;
`;

const EmptyDescription = styled.p`
  color: #6b7280;
  margin: 0;
`;

// Mock data
const mockUsers = [
  {
    id: 1,
    name: "Joshua Crass",
    email: "joshua.crass@gmail.com",
    role: "admin",
    status: "active",
    lastLogin: "2025-01-09",
    avatar: "JC",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah.johnson@company.com",
    role: "manager",
    status: "active",
    lastLogin: "2025-01-08",
    avatar: "SJ",
  },
  {
    id: 3,
    name: "Mike Chen",
    email: "mike.chen@company.com",
    role: "staff",
    status: "active",
    lastLogin: "2025-01-07",
    avatar: "MC",
  },
  {
    id: 4,
    name: "Emma Wilson",
    email: "emma.wilson@company.com",
    role: "staff",
    status: "suspended",
    lastLogin: "2025-01-05",
    avatar: "EW",
  },
  {
    id: 5,
    name: "David Brown",
    email: "david.brown@company.com",
    role: "staff",
    status: "inactive",
    lastLogin: "2024-12-15",
    avatar: "DB",
  },
  {
    id: 6,
    name: "Lisa Garcia",
    email: "lisa.garcia@company.com",
    role: "manager",
    status: "active",
    lastLogin: "2025-01-08",
    avatar: "LG",
  },
];

const AdminUserManagement = () => {
  const [users, setUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const handleEditUser = userId => {
    console.log("Edit user:", userId);
  };

  const handleDeleteUser = userId => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  const handleAddUser = () => {
    console.log("Add new user");
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || user.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === "active").length;
  const adminUsers = users.filter(u => u.role === "admin").length;
  const inactiveUsers = users.filter(u => u.status === "inactive").length;

  const getAvatarColor = index => {
    const colors = [
      "#3b82f6", // blue
      "#10b981", // emerald
      "#f59e0b", // amber
      "#8b5cf6", // violet
      "#ef4444", // red
      "#06b6d4", // cyan
    ];
    return colors[index % colors.length];
  };

  return (
    <Container>
      <ContentWrapper>
        <Header>
          <HeaderContent>
            <Title>User Management</Title>
            <Subtitle>
              Manage user accounts, permissions, and access controls
            </Subtitle>
          </HeaderContent>
          <ActionButton onClick={handleAddUser}>
            <Plus size={20} />
            Add New User
          </ActionButton>
        </Header>

        <StatsGrid>
          <StatsCard>
            <StatsContent>
              <StatsIcon gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
                <Users size={24} />
              </StatsIcon>
              <StatsInfo>
                <StatsLabel>Total Users</StatsLabel>
                <StatsValue>{totalUsers}</StatsValue>
              </StatsInfo>
            </StatsContent>
          </StatsCard>

          <StatsCard>
            <StatsContent>
              <StatsIcon gradient="linear-gradient(135deg, #10b981 0%, #059669 100%)">
                <Activity size={24} />
              </StatsIcon>
              <StatsInfo>
                <StatsLabel>Active Users</StatsLabel>
                <StatsValue>{activeUsers}</StatsValue>
              </StatsInfo>
            </StatsContent>
          </StatsCard>

          <StatsCard>
            <StatsContent>
              <StatsIcon gradient="linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)">
                <Shield size={24} />
              </StatsIcon>
              <StatsInfo>
                <StatsLabel>Administrators</StatsLabel>
                <StatsValue>{adminUsers}</StatsValue>
              </StatsInfo>
            </StatsContent>
          </StatsCard>

          <StatsCard>
            <StatsContent>
              <StatsIcon gradient="linear-gradient(135deg, #ef4444 0%, #dc2626 100%)">
                <UserX size={24} />
              </StatsIcon>
              <StatsInfo>
                <StatsLabel>Inactive Users</StatsLabel>
                <StatsValue>{inactiveUsers}</StatsValue>
              </StatsInfo>
            </StatsContent>
          </StatsCard>
        </StatsGrid>

        <MainCard>
          <SearchSection>
            <SearchGrid>
              <InputWrapper>
                <SearchIcon>
                  <Search size={20} />
                </SearchIcon>
                <SearchInput
                  type="text"
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </InputWrapper>
              <InputWrapper>
                <FilterIcon>
                  <Filter size={20} />
                </FilterIcon>
                <FilterSelect
                  value={filterStatus}
                  onChange={e => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                  <option value="inactive">Inactive</option>
                </FilterSelect>
              </InputWrapper>
            </SearchGrid>
          </SearchSection>

          <TableContainer>
            <Table>
              <TableHeader>
                <tr>
                  <TableHeaderCell>User</TableHeaderCell>
                  <TableHeaderCell>Role</TableHeaderCell>
                  <TableHeaderCell>Status</TableHeaderCell>
                  <TableHeaderCell>Last Login</TableHeaderCell>
                  <TableHeaderCell>Actions</TableHeaderCell>
                </tr>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user, index) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <UserInfo>
                        <Avatar gradient={getAvatarColor(index)}>
                          {user.avatar}
                        </Avatar>
                        <UserDetails>
                          <UserName>{user.name}</UserName>
                          <UserEmail>
                            <Mail size={14} />
                            {user.email}
                          </UserEmail>
                        </UserDetails>
                      </UserInfo>
                    </TableCell>
                    <TableCell>
                      <Badge type={user.role}>{user.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge type={user.status}>{user.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <DateInfo>
                        <Calendar size={14} />
                        {user.lastLogin}
                      </DateInfo>
                    </TableCell>
                    <TableCell>
                      <ActionsContainer>
                        <ActionIcon
                          variant="edit"
                          onClick={() => handleEditUser(user.id)}
                          title="Edit user"
                        >
                          <Pencil size={16} />
                        </ActionIcon>
                        <ActionIcon
                          variant="delete"
                          onClick={() => handleDeleteUser(user.id)}
                          title="Delete user"
                        >
                          <Trash2 size={16} />
                        </ActionIcon>
                        <ActionIcon title="More options">
                          <MoreVertical size={16} />
                        </ActionIcon>
                      </ActionsContainer>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {filteredUsers.length === 0 && (
            <EmptyState>
              <EmptyIcon>
                <User size={32} />
              </EmptyIcon>
              <EmptyTitle>No users found</EmptyTitle>
              <EmptyDescription>
                Try adjusting your search criteria or filter options.
              </EmptyDescription>
            </EmptyState>
          )}
        </MainCard>
      </ContentWrapper>
    </Container>
  );
};

export default AdminUserManagement;
