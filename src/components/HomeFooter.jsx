// src/components/Footer.jsx
import styled from "@emotion/styled";

const FooterContainer = styled.footer`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 30rem;
  width: 100vw;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
`;

const FooterTitle = styled.h5`
  ${({ theme }) => theme.mixins.textH5}
`;

const HomeFooter = () => {
  return (
    <FooterContainer>
      <FooterTitle>
        <p>Footer</p>
      </FooterTitle>
    </FooterContainer>
  );
};

export default HomeFooter;
