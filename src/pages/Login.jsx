// src/pages/Login.jsx
import React, { useState } from "react";
import styled from "@emotion/styled";
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import GoogleSignInButton from "../components/GoogleSignInButton";
import { useAuth } from "../contexts/AuthContext";

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary} 0%,
    ${({ theme }) => theme.colors.info} 100%
  );
  padding: 16px;
  font-family: ${({ theme }) => theme.fonts.primary};

  @media (min-width: 768px) {
    padding: 24px;
  }
`;

const LoginCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  box-shadow: 0 10px 25px ${({ theme }) => theme.colors.shadow};
  padding: 24px;
  width: 100%;
  max-width: 400px;
  border: 1px solid ${({ theme }) => theme.colors.border};

  @media (min-width: 480px) {
    padding: 32px;
    border-radius: 16px;
  }

  @media (min-width: 768px) {
    padding: 48px;
    box-shadow: 0 20px 40px ${({ theme }) => theme.colors.shadow};
  }
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
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
  color: ${({ theme }) => theme.colors.textSecondary};
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
  color: ${({ theme }) => theme.colors.textPrimary};

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
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.textPrimary};
  background: ${({ theme }) => theme.colors.surface};
  transition: all 0.2s ease;
  box-sizing: border-box;
  min-height: 48px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray400};
  }

  ${props =>
    props.hasError &&
    `
    border-color: ${({ theme }) => theme.colors.danger};
    &:focus {
      border-color: ${({ theme }) => theme.colors.danger};
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
  color: ${({ theme }) => theme.colors.gray400};
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
  color: ${({ theme }) => theme.colors.gray400};
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
    color: ${({ theme }) => theme.colors.textSecondary};
  }

  &:focus {
    outline: none;
    color: ${({ theme }) => theme.colors.primary};
  }

  @media (min-width: 480px) {
    right: 14px;
    padding: 4px;
  }
`;

const ErrorMessage = styled.span`
  color: ${({ theme }) => theme.colors.danger};
  font-size: 14px;
  margin-top: 4px;
`;

const ForgotPassword = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 14px;
  cursor: pointer;
  text-align: center;
  margin-top: 12px;
  padding: 10px 8px;
  border-radius: 4px;
  transition: color 0.2s ease;
  min-height: 40px;

  &:hover {
    color: ${({ theme }) => theme.colors.info};
    text-decoration: underline;
  }

  &:focus {
    outline: none;
    color: ${({ theme }) => theme.colors.info};
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
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 13px;

  &::before,
  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: ${({ theme }) => theme.colors.border};
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

const SignUpLink = styled.div`
  text-align: center;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 13px;
  line-height: 1.4;

  button {
    background: none;
    border: none;
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 500;
    cursor: pointer;
    margin-left: 4px;
    padding: 4px;
    border-radius: 2px;
    min-height: 32px;

    &:hover {
      color: ${({ theme }) => theme.colors.info};
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

const BackToHomeWrapper = styled.div`
  margin-top: 24px;

  @media (min-width: 480px) {
    margin-top: 28px;
  }

  @media (min-width: 768px) {
    margin-top: 32px;
  }
`;

const Login = () => {
  const { signInWithEmail, resetPassword } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading] = useState(false);

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

    try {
      const { user, error } = await signInWithEmail(
        formData.email,
        formData.password
      );

      if (error) {
        // Handle Firebase auth errors
        if (error.includes("user-not-found")) {
          setErrors({ email: "No account found with this email address" });
        } else if (error.includes("wrong-password")) {
          setErrors({ password: "Incorrect password" });
        } else if (error.includes("invalid-email")) {
          setErrors({ email: "Invalid email address" });
        } else if (error.includes("too-many-requests")) {
          setErrors({
            general: "Too many failed attempts. Please try again later.",
          });
        } else {
          setErrors({ general: "Login failed. Please try again." });
        }
      } else {
        // Success - redirect to profile page
        console.log("Login successful:", user);
        navigate("/profile");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrors({ general: "An unexpected error occurred. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      setErrors({ email: "Please enter your email address first" });
      return;
    }

    try {
      const { error } = await resetPassword(formData.email);
      if (error) {
        if (error.includes("user-not-found")) {
          setErrors({ email: "No account found with this email address" });
        } else {
          setErrors({
            general: "Failed to send reset email. Please try again.",
          });
        }
      } else {
        alert(`Password reset email sent to ${formData.email}`);
      }
    } catch (error) {
      console.error("Reset password error:", error);
      setErrors({ general: "An unexpected error occurred. Please try again." });
    }
  };

  const handleSignUp = () => {
    // TODO: Navigate to sign up page
    alert("Sign up page will be implemented");
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  const handleGoogleSignIn = user => {
    console.log("Google sign-in successful:", user);
    navigate("/profile");
  };

  const handleGoogleSignInError = error => {
    console.error("Google sign-in error:", error);
    if (error.includes("popup-closed-by-user")) {
      // User closed the popup, no need to show error
      return;
    } else if (error.includes("popup-blocked")) {
      setErrors({
        general: "Popup blocked. Please allow popups and try again.",
      });
    } else {
      setErrors({ general: "Google sign-in failed. Please try again." });
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

          {errors.general && <ErrorMessage>{errors.general}</ErrorMessage>}

          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            disabled={isLoading}
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </Button>
        </Form>

        <ForgotPassword type="button" onClick={handleForgotPassword}>
          Forgot your password?
        </ForgotPassword>

        <Divider>or continue with</Divider>

        <GoogleSignInButton
          onSuccess={handleGoogleSignIn}
          onError={handleGoogleSignInError}
          disabled={isGoogleLoading || isLoading}
          isLoading={isGoogleLoading}
        />

        <SignUpLink>
          Dont have an account?
          <button type="button" onClick={handleSignUp}>
            Sign up
          </button>
        </SignUpLink>
      </LoginCard>

      <BackToHomeWrapper>
        <Button variant="ghost" onClick={handleBackToHome}>
          <ArrowLeft size={16} />
          Back to Home
        </Button>
      </BackToHomeWrapper>
    </LoginContainer>
  );
};

export default Login;
