// src/pages/Login.jsx
import React, { useState } from "react";
import styled from "@emotion/styled";
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from "lucide-react";
import colors from "../theme/colors";

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    135deg,
    ${colors.primary} 0%,
    ${colors.info} 100%
  );
  padding: 16px;
  font-family:
    "Questrial",
    -apple-system,
    BlinkMacSystemFont,
    sans-serif;

  @media (min-width: 768px) {
    padding: 24px;
  }
`;

const LoginCard = styled.div`
  background: ${colors.surface};
  border-radius: 12px;
  box-shadow: 0 10px 25px ${colors.shadow};
  padding: 24px;
  width: 100%;
  max-width: 400px;
  border: 1px solid ${colors.border};

  @media (min-width: 480px) {
    padding: 32px;
    border-radius: 16px;
  }

  @media (min-width: 768px) {
    padding: 48px;
    box-shadow: 0 20px 40px ${colors.shadow};
  }
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: ${colors.textPrimary};
  margin: 0 0 6px 0;
  text-align: center;

  @media (min-width: 480px) {
    font-size: 26px;
    margin: 0 0 8px 0;
  }

  @media (min-width: 768px) {
    font-size: 28px;
  }
`;

const Subtitle = styled.p`
  color: ${colors.textSecondary};
  font-size: 14px;
  margin: 0 0 24px 0;
  text-align: center;
  line-height: 1.4;

  @media (min-width: 480px) {
    font-size: 15px;
    margin: 0 0 28px 0;
  }

  @media (min-width: 768px) {
    font-size: 16px;
    margin: 0 0 32px 0;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media (min-width: 480px) {
    gap: 22px;
  }

  @media (min-width: 768px) {
    gap: 24px;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  @media (min-width: 480px) {
    gap: 8px;
  }
`;

const Label = styled.label`
  font-size: 13px;
  font-weight: 500;
  color: ${colors.textPrimary};

  @media (min-width: 480px) {
    font-size: 14px;
  }
`;

const InputWrapper = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 16px;
  padding-left: 40px;
  border: 1px solid ${colors.border};
  border-radius: 8px;
  font-size: 16px;
  color: ${colors.textPrimary};
  background: ${colors.surface};
  transition: all 0.2s ease;
  box-sizing: border-box;
  min-height: 48px;

  &:focus {
    outline: none;
    border-color: ${colors.primary};
    box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
  }

  &::placeholder {
    color: ${colors.gray400};
  }

  ${props =>
    props.hasError &&
    `
    border-color: ${colors.danger};
    &:focus {
      border-color: ${colors.danger};
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }
  `}

  @media (min-width: 480px) {
    padding: 12px 16px;
    padding-left: 44px;
  }
`;

const PasswordInput = styled(Input)`
  padding-right: 40px;

  @media (min-width: 480px) {
    padding-right: 44px;
  }
`;

const InputIcon = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: ${colors.gray400};
  pointer-events: none;

  @media (min-width: 480px) {
    left: 14px;
  }
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: ${colors.gray400};
  cursor: pointer;
  padding: 6px;
  border-radius: 4px;
  transition: color 0.2s ease;
  min-width: 32px;
  min-height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: ${colors.textSecondary};
  }

  &:focus {
    outline: none;
    color: ${colors.primary};
  }

  @media (min-width: 480px) {
    right: 14px;
    padding: 4px;
  }
`;

const ErrorMessage = styled.span`
  color: ${colors.danger};
  font-size: 14px;
  margin-top: 4px;
`;

const LoginButton = styled.button`
  width: 100%;
  padding: 16px 24px;
  background: ${colors.primary};
  color: ${colors.white};
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 4px;
  min-height: 52px;

  &:hover {
    background: ${colors.info};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background: ${colors.gray300};
    cursor: not-allowed;
    transform: none;
  }

  ${props =>
    props.isLoading &&
    `
    background: ${colors.gray300};
    cursor: not-allowed;
  `}

  @media (min-width: 480px) {
    padding: 14px 24px;
    margin-top: 8px;
  }
`;

const ForgotPassword = styled.button`
  background: none;
  border: none;
  color: ${colors.primary};
  font-size: 14px;
  cursor: pointer;
  text-align: center;
  margin-top: 12px;
  padding: 10px 8px;
  border-radius: 4px;
  transition: color 0.2s ease;
  min-height: 40px;

  &:hover {
    color: ${colors.info};
    text-decoration: underline;
  }

  &:focus {
    outline: none;
    color: ${colors.info};
  }

  @media (min-width: 480px) {
    margin-top: 16px;
    padding: 8px;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 20px 0;
  color: ${colors.textSecondary};
  font-size: 13px;

  &::before,
  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: ${colors.border};
  }

  &::before {
    margin-right: 12px;
  }

  &::after {
    margin-left: 12px;
  }

  @media (min-width: 480px) {
    margin: 22px 0;
    font-size: 14px;

    &::before {
      margin-right: 16px;
    }

    &::after {
      margin-left: 16px;
    }
  }

  @media (min-width: 768px) {
    margin: 24px 0;
  }
`;

const GoogleButton = styled.button`
  width: 100%;
  padding: 14px 24px;
  background: ${colors.surface};
  color: ${colors.textPrimary};
  border: 1px solid ${colors.border};
  border-radius: 8px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 48px;

  &:hover {
    background: ${colors.gray100};
    border-color: ${colors.gray300};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background: ${colors.gray100};
    color: ${colors.gray400};
    cursor: not-allowed;
    transform: none;
  }

  ${props =>
    props.isLoading &&
    `
    background: ${colors.gray100};
    color: ${colors.gray400};
    cursor: not-allowed;
  `}

  @media (min-width: 480px) {
    padding: 12px 24px;
    font-size: 16px;
    gap: 12px;
  }
`;

const SignUpLink = styled.div`
  text-align: center;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid ${colors.border};
  color: ${colors.textSecondary};
  font-size: 13px;
  line-height: 1.4;

  button {
    background: none;
    border: none;
    color: ${colors.primary};
    font-weight: 500;
    cursor: pointer;
    margin-left: 4px;
    padding: 4px;
    border-radius: 2px;
    min-height: 32px;

    &:hover {
      color: ${colors.info};
      text-decoration: underline;
    }
  }

  @media (min-width: 480px) {
    margin-top: 22px;
    padding-top: 22px;
    font-size: 14px;

    button {
      padding: 2px;
    }
  }

  @media (min-width: 768px) {
    margin-top: 24px;
    padding-top: 24px;
  }
`;

const BackToHomeLink = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  padding: 12px 16px;
  border-radius: 8px;
  margin-top: 24px;
  transition: all 0.2s ease;
  min-height: 44px;

  &:hover {
    color: ${colors.white};
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  @media (min-width: 480px) {
    margin-top: 28px;
    font-size: 15px;
  }

  @media (min-width: 768px) {
    margin-top: 32px;
  }
`;

// Google Icon Component
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Simulate API call - replace with Firebase auth later
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      // TODO: Implement Firebase authentication here
      alert("Login functionality will be connected to Firebase");
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // TODO: Implement forgot password functionality
    alert("Forgot password functionality will be implemented with Firebase");
  };

  const handleSignUp = () => {
    // TODO: Navigate to sign up page
    alert("Sign up page will be implemented");
  };

  const handleBackToHome = () => {
    // TODO: Navigate to home page using React Router
    window.location.href = "/";
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);

    try {
      // Simulate Google sign-in - replace with Firebase Google auth later
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("Google sign-in attempt");
      // TODO: Implement Firebase Google authentication here
      alert("Google Sign-In will be connected to Firebase");
    } catch (error) {
      console.error("Google sign-in error:", error);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <LoginContainer>
      <LoginCard>
        <Title>Welcome Back</Title>
        <Subtitle>Sign in to your Unit 902 account</Subtitle>

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="email">Email Address</Label>
            <InputWrapper>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                hasError={!!errors.email}
                autoComplete="email"
              />
              <InputIcon>
                <Mail size={18} />
              </InputIcon>
            </InputWrapper>
            {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="password">Password</Label>
            <InputWrapper>
              <PasswordInput
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                hasError={!!errors.password}
                autoComplete="current-password"
              />
              <InputIcon>
                <Lock size={18} />
              </InputIcon>
              <PasswordToggle
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </PasswordToggle>
            </InputWrapper>
            {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
          </FormGroup>

          <LoginButton type="submit" isLoading={isLoading} disabled={isLoading}>
            {isLoading ? "Signing In..." : "Sign In"}
          </LoginButton>
        </Form>

        <ForgotPassword type="button" onClick={handleForgotPassword}>
          Forgot your password?
        </ForgotPassword>

        <Divider>or continue with</Divider>

        <GoogleButton
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading || isLoading}
          isLoading={isGoogleLoading}
        >
          <GoogleIcon />
          {isGoogleLoading ? "Signing in..." : "Continue with Google"}
        </GoogleButton>

        <SignUpLink>
          Don't have an account?
          <button type="button" onClick={handleSignUp}>
            Sign up
          </button>
        </SignUpLink>
      </LoginCard>

      <BackToHomeLink onClick={handleBackToHome}>
        <ArrowLeft size={16} />
        Back to Home
      </BackToHomeLink>
    </LoginContainer>
  );
};

export default Login;
