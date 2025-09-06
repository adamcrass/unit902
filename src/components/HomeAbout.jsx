// src/components/HomeAbout.jsx
import styled from "@emotion/styled";

const HomeAboutContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: 100vw;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
`;

const HomeAboutTitle = styled.h5`
  ${({ theme }) => theme.mixins.textH5}
`;

const HomeAbout = () => {
  return (
    <HomeAboutContainer id="about">
      <HomeAboutTitle>About</HomeAboutTitle>
    </HomeAboutContainer>
  );
};

export default HomeAbout;
