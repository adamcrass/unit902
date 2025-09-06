// src/pages/Profile.jsx
import React from "react";
import styled from "@emotion/styled";
import { User, Mail, Calendar, LogOut, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Button from "../components/Button";

const ProfileContainer = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.gray50 || "#f9fafb"};
  font-family: ${({ theme }) => theme.fonts.primary};
`;

const ProfileHeader = styled.div`
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary} 0%,
    ${({ theme }) => theme.colors.info} 100%
  );
  color: ${({ theme }) => theme.colors.white};
  padding: 2rem 1rem;
  
  @media (min-width: 768px) {
    padding: 3rem 2rem;
  }
`;

const ProfileHeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  cursor: pointer;
  padding: 0.5rem 0;
  transition: color 0.2s ease;
  
  &:hover {
    color: ${({ theme }) => theme.colors.white};
  }
`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1rem;
  
  @media (min-width: 768px) {
    flex-direction: row;
    text-align: left;
  }
`;

const Avatar = styled.div`
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  
  @media (min-width: 768px) {
    width: 100px;
    height: 100px;
  }
`;

const UserDetails = styled.div`
  flex: 1;
`;

const UserName = styled.h1`
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  
  @media (min-width: 768px) {
    font-size: 32px;
  }
`;

const UserEmail = styled.p`
  font-size: 16px;
  opacity: 0.9;
  margin: 0;
`;

const ProfileContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  
  @media (min-width: 768px) {
    padding: 3rem 2rem;
  }
`;

const ProfileCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid ${({ theme }) => theme.colors.border};
  overflow: hidden;
`;

const CardHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  
  h2 {
    font-size: 20px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.textPrimary};
    margin: 0;
  }
`;

const CardContent = styled.div`
  padding: 1.5rem;
`;

const InfoGrid = styled.div`
  display: grid;
  gap: 1.5rem;
  
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: ${({ theme }) => theme.colors.gray50 || "#f9fafb"};
  border-radius: 8px;
`;

const InfoIcon = styled.div`
  color: ${({ theme }) => theme.colors.primary};
  flex-shrink: 0;
`;

const InfoText = styled.div`
  flex: 1;
  
  .label {
    font-size: 14px;
    color: ${({ theme }) => theme.colors.textSecondary};
    margin-bottom: 0.25rem;
  }
  
  .value {
    font-size: 16px;
    color: ${({ theme }) => theme.colors.textPrimary};
    font-weight: 500;
  }
`;

const ActionsSection = styled.div`
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await logout();
    if (!error) {
      navigate('/');
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  // Format join date
  const formatJoinDate = (user) => {
    if (user?.metadata?.creationTime) {
      return new Date(user.metadata.creationTime).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
    return 'Unknown';
  };

  // Get display name
  const getDisplayName = (user) => {
    return user?.displayName || user?.email?.split('@')[0] || 'User';
  };

  return (
    <ProfileContainer>
      <ProfileHeader>
        <ProfileHeaderContent>
          <BackButton onClick={handleBackToHome}>
            <ArrowLeft size={16} />
            Back to Home
          </BackButton>
          
          <ProfileInfo>
            <Avatar>
              <User size={40} />
            </Avatar>
            <UserDetails>
              <UserName>{getDisplayName(user)}</UserName>
              <UserEmail>{user?.email}</UserEmail>
            </UserDetails>
          </ProfileInfo>
        </ProfileHeaderContent>
      </ProfileHeader>

      <ProfileContent>
        <ProfileCard>
          <CardHeader>
            <h2>Account Information</h2>
          </CardHeader>
          <CardContent>
            <InfoGrid>
              <InfoItem>
                <InfoIcon>
                  <Mail size={20} />
                </InfoIcon>
                <InfoText>
                  <div className="label">Email Address</div>
                  <div className="value">{user?.email}</div>
                </InfoText>
              </InfoItem>
              
              <InfoItem>
                <InfoIcon>
                  <User size={20} />
                </InfoIcon>
                <InfoText>
                  <div className="label">Display Name</div>
                  <div className="value">{getDisplayName(user)}</div>
                </InfoText>
              </InfoItem>
              
              <InfoItem>
                <InfoIcon>
                  <Calendar size={20} />
                </InfoIcon>
                <InfoText>
                  <div className="label">Member Since</div>
                  <div className="value">{formatJoinDate(user)}</div>
                </InfoText>
              </InfoItem>
              
              <InfoItem>
                <InfoIcon>
                  <User size={20} />
                </InfoIcon>
                <InfoText>
                  <div className="label">Account Status</div>
                  <div className="value">
                    {user?.emailVerified ? 'Verified' : 'Unverified'}
                  </div>
                </InfoText>
              </InfoItem>
            </InfoGrid>

            <ActionsSection>
              <Button variant="ghost" onClick={handleBackToHome}>
                Back to Home
              </Button>
              <Button variant="primary" onClick={handleLogout}>
                <LogOut size={16} />
                Sign Out
              </Button>
            </ActionsSection>
          </CardContent>
        </ProfileCard>
      </ProfileContent>
    </ProfileContainer>
  );
};

export default Profile;
