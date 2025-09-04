// src/pages/Login.jsx
import styled from "@emotion/styled";

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.layout.spacing.lg};
`;

const Login = () => {
  return (
    <LoginContainer>
      <h1>Login</h1>
    </LoginContainer>
  );
};

export default Login;
