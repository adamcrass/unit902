// src/pages/Admin.jsx
import styled from "@emotion/styled";

const AdminContainer = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  padding: 2rem;
  ${({ theme }) => theme.mixins.flexColCenter}
`;

const Admin = () => {
  return (
    <AdminContainer>
      <h1>Admin</h1>
    </AdminContainer>
  );
};

export default Admin;
