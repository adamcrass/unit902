// src/components/Admin/UserProfileSection.jsx
import React, { useState, useEffect, useCallback } from 'react';
import styled from '@emotion/styled';
import { useAuth } from 'context/AuthContext';
import Input from 'components/common/Input';
import { getUserById, updateUser } from 'services/userService';
import {
  User,
  AlertCircle,
  Check,
  Briefcase,
  Image,
  Shield,
} from 'lucide-react';

// Styled components
const SectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin: 16px;
  flex: 1;
`;

const Header = styled.div`
  padding: 20px 24px;
  background-color: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const HeaderIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: #f3f4f6;
  border-radius: 8px;
  color: #4b5563;
`;

const HeaderTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0;
`;

const HeaderDescription = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin: 4px 0 0;
`;

const MainContent = styled.div`
  padding: 16px 24px;
`;

const AvatarSection = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
  padding: 2rem;
  border-bottom: 1px solid #e5e7eb;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 12px;
`;

const AvatarWrapper = styled.div`
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 1rem;
  border: 3px solid #e5e7eb;
  background: #f9fafb;
  transition: border-color 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.secondary};
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const AvatarFallback = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 1.5rem;
  font-weight: 600;
  text-transform: uppercase;
`;

const ProfileInfo = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`;

const ProfileName = styled.h3`
  font-weight: 600;
  font-size: 18px;
  color: #111827;
  margin: 0;
`;

const ProfileEmail = styled.p`
  color: #6b7280;
  font-size: 14px;
  margin: 0;
`;

const BadgeContainer = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: flex-end;
`;

const RoleBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  padding: 0.375rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
`;

const JobTitleBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  padding: 0.375rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(16, 185, 129, 0.3);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  &.full-width {
    grid-column: 1 / -1;
  }
`;

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormSectionHeader = styled.div`
  h3 {
    font-size: 1rem;
    font-weight: 600;
    color: #111827;
    margin: 0 0 0.25rem 0;
  }

  p {
    font-size: 0.875rem;
    color: #6b7280;
    margin: 0;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1rem;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: flex-end;
  }
`;

const Button = styled.button`
  padding: 0.625rem 1.25rem;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-width: 120px;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }
`;

const PrimaryButton = styled(Button)`
  background: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.primaryDark};

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.secondaryDark};
    transform: translateY(-1px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

const Alert = styled.div`
  padding: 0.875rem 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  animation: slideIn 0.3s ease;

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-0.5rem);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  ${({ variant }) => {
    switch (variant) {
      case 'success':
        return `
          background: #d1fae5;
          color: #065f46;
          border: 1px solid #a7f3d0;
        `;
      case 'error':
        return `
          background: #fee2e2;
          color: #991b1b;
          border: 1px solid #fecaca;
        `;
      default:
        return '';
    }
  }}

  svg {
    flex-shrink: 0;
    margin-top: 0.125rem;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1.5rem;
  color: #6b7280;

  svg {
    margin: 0 auto 1rem;
    color: #d1d5db;
  }

  h3 {
    font-size: 1.125rem;
    font-weight: 600;
    color: #374151;
    margin: 0 0 0.5rem 0;
  }

  p {
    font-size: 0.875rem;
    margin: 0;
  }
`;

// Utility functions
const getInitials = (name) => {
  if (!name) return 'U';
  return name
    .split(' ')
    .map((n) => n[0])
    .filter(Boolean)
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const transformImageUrl = (url) => {
  if (!url) return '';

  // Handle Google Cloud Storage URLs
  if (url.includes('storage.cloud.google.com')) {
    return url
      .replace('storage.cloud.google.com', 'storage.googleapis.com')
      .replace(/\?authuser=\d+/, '');
  }

  return url;
};

const UserProfileSection = () => {
  const { user, updateProfile } = useAuth();

  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    imageUrl: '',
    jobTitle: '',
  });

  const [userData, setUserData] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: null, message: '' });
  const [imageError, setImageError] = useState(false);

  // Initialize form with user data
  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.uid) {
        try {
          // Fetch complete user data from database
          const dbUserData = await getUserById(user.uid);
          setUserData(dbUserData);

          setFormData({
            displayName: user.displayName || dbUserData?.displayName || '',
            email: user.email || dbUserData?.email || '',
            imageUrl: user.photoURL || '',
            jobTitle: dbUserData?.jobTitle || '',
          });
          setImageError(false);
        } catch (error) {
          console.error('Error fetching user data:', error);
          // Fallback to auth user data only
          setFormData({
            displayName: user.displayName || '',
            email: user.email || '',
            imageUrl: user.photoURL || '',
            jobTitle: '',
          });
          setImageError(false);
        }
      }
    };

    fetchUserData();
  }, [user]);

  // Auto-dismiss feedback messages
  useEffect(() => {
    if (feedback.type) {
      const timer = setTimeout(() => {
        setFeedback({ type: null, message: '' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      // Clear field-specific error
      if (errors[name]) {
        setErrors((prev) => ({
          ...prev,
          [name]: null,
        }));
      }

      // Reset image error when URL changes
      if (name === 'imageUrl') {
        setImageError(false);
      }
    },
    [errors],
  );

  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!formData.displayName.trim()) {
      newErrors.displayName = 'Display name is required';
    } else if (formData.displayName.trim().length < 2) {
      newErrors.displayName = 'Display name must be at least 2 characters';
    }

    // Job title validation (optional but if provided, must be reasonable length)
    if (formData.jobTitle && formData.jobTitle.trim().length > 100) {
      newErrors.jobTitle = 'Job title must be less than 100 characters';
    }

    // Validate image URL if provided
    if (formData.imageUrl && !formData.imageUrl.match(/^https?:\/\/.+/)) {
      newErrors.imageUrl =
        'Please enter a valid URL starting with http:// or https://';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous feedback
    setFeedback({ type: null, message: '' });

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Update Firebase Auth profile (display name and photo)
      const authUpdateData = {
        displayName: formData.displayName.trim(),
      };

      if (formData.imageUrl) {
        authUpdateData.photoURL = formData.imageUrl.trim();
      }

      // Update database profile (job title and other fields)
      const dbUpdateData = {
        displayName: formData.displayName.trim(),
        jobTitle: formData.jobTitle.trim(),
      };

      // Update both Firebase Auth and database
      const [authResult, dbResult] = await Promise.all([
        updateProfile(authUpdateData),
        updateUser(user.uid, dbUpdateData),
      ]);

      if (authResult.success && dbResult) {
        // Refresh user data
        const updatedUserData = await getUserById(user.uid);
        setUserData(updatedUserData);

        setFeedback({
          type: 'success',
          message: 'Profile updated successfully!',
        });
      } else {
        setFeedback({
          type: 'error',
          message: 'Failed to update profile. Please try again.',
        });
      }
    } catch (error) {
      console.error('Profile update error:', error);
      setFeedback({
        type: 'error',
        message:
          error.message || 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  // Handle unauthenticated state
  if (!user) {
    return (
      <SectionContainer>
        <EmptyState>
          <User size={48} />
          <h3>Profile not available</h3>
          <p>Please log in to view and manage your profile.</p>
        </EmptyState>
      </SectionContainer>
    );
  }

  const displayImageUrl = transformImageUrl(formData.imageUrl || user.photoURL);
  const showAvatar = displayImageUrl && !imageError;

  return (
    <SectionContainer>
      <Header>
        <HeaderContent>
          <HeaderIcon>
            <User size={20} />
          </HeaderIcon>
          <div>
            <HeaderTitle>User Profile</HeaderTitle>
            <HeaderDescription>
              Manage your personal information and profile settings
            </HeaderDescription>
          </div>
        </HeaderContent>
      </Header>

      <MainContent>
        {feedback.type && (
          <Alert variant={feedback.type}>
            {feedback.type === 'success' ? (
              <Check size={18} />
            ) : (
              <AlertCircle size={18} />
            )}
            <span>{feedback.message}</span>
          </Alert>
        )}

        <AvatarSection>
          <BadgeContainer>
            <RoleBadge>
              <Shield size={12} />
              {userData?.role
                ? userData.role.charAt(0).toUpperCase() + userData.role.slice(1)
                : 'User'}
            </RoleBadge>
            {userData?.jobTitle && (
              <JobTitleBadge>
                <Briefcase size={12} />
                {userData.jobTitle}
              </JobTitleBadge>
            )}
          </BadgeContainer>

          <AvatarWrapper>
            {showAvatar ? (
              <img
                src={displayImageUrl}
                alt={`${user.displayName || 'User'} avatar`}
                onError={handleImageError}
              />
            ) : (
              <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
            )}
          </AvatarWrapper>

          <ProfileInfo>
            <ProfileName>{user.displayName || 'Unknown User'}</ProfileName>
            <ProfileEmail>{user.email}</ProfileEmail>
          </ProfileInfo>
        </AvatarSection>

        <Form onSubmit={handleSubmit} noValidate>
          <FormSection>
            <FormSectionHeader>
              <h3>Personal Information</h3>
              <p>Update your profile details</p>
            </FormSectionHeader>

            <FormGrid>
              <FormGroup>
                <Input
                  label="Display Name"
                  id="displayName"
                  name="displayName"
                  type="text"
                  placeholder="Enter your display name"
                  value={formData.displayName}
                  onChange={handleChange}
                  error={errors.displayName}
                  required
                  autoComplete="name"
                  icon={<User size={18} />}
                />
              </FormGroup>

              <FormGroup>
                <Input
                  label="Job Title"
                  id="jobTitle"
                  name="jobTitle"
                  type="text"
                  placeholder="Enter your job title (e.g., Manager, Server, Chef)"
                  value={formData.jobTitle}
                  onChange={handleChange}
                  error={errors.jobTitle}
                  helpText="Optional field to specify your position or role"
                  autoComplete="organization-title"
                  icon={<Briefcase size={18} />}
                />
              </FormGroup>

              <FormGroup className="full-width">
                <Input
                  label="Profile Image URL"
                  id="imageUrl"
                  name="imageUrl"
                  type="url"
                  placeholder="https://example.com/your-image.jpg"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  error={errors.imageUrl}
                  helpText="Enter a direct link to your profile image"
                  autoComplete="photo"
                  icon={<Image size={18} />}
                />
              </FormGroup>
            </FormGrid>
          </FormSection>

          <ButtonGroup>
            <PrimaryButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </PrimaryButton>
          </ButtonGroup>
        </Form>
      </MainContent>
    </SectionContainer>
  );
};

export default UserProfileSection;
