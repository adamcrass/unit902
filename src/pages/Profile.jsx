// src/pages/Profile.jsx
import React from "react";
import styled from "@emotion/styled";
import { User, Mail, Calendar, LogOut } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import Button from "../components/Button";
import ProfileHeader from "../components/ProfileHeader";

const ProfileContainer = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.surface};
  font-family: ${({ theme }) => theme.fonts.primary};
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
  const { user } = useAuth();

  // Format join date
  const formatJoinDate = user => {
    if (user?.metadata?.creationTime) {
      return new Date(user.metadata.creationTime).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
    return "Unknown";
  };

  // Get display name
  const getDisplayName = user => {
    return user?.displayName || user?.email?.split("@")[0] || "User";
  };

  const handleEdit = () => {
    // TODO: Implement edit functionality
  };

  return (
    <ProfileContainer>
      <ProfileHeader />

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
                    {user?.emailVerified ? "Verified" : "Unverified"}
                  </div>
                </InfoText>
              </InfoItem>
            </InfoGrid>

            <ActionsSection>
              <Button variant="primary" onClick={handleEdit}>
                Edit
              </Button>
            </ActionsSection>
          </CardContent>
        </ProfileCard>
      </ProfileContent>
    </ProfileContainer>
  );
};

export default Profile;
