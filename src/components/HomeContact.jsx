// src/components/HomeContact.jsx
import styled from "@emotion/styled";

const HomeContactContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: 100vw;
  background: ${({ theme }) => theme.colors.gray300};
  color: ${({ theme }) => theme.colors.primary};
`;

const HomeContactTitle = styled.h5`
  ${({ theme }) => theme.mixins.textH5}
`;

const HomeContact = () => {
  return (
    <HomeContactContainer id="contact">
      <HomeContactTitle>Contact</HomeContactTitle>
    </HomeContactContainer>
  );
};

export default HomeContact;
