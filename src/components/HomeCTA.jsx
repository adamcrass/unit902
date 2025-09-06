// src/components/HomeCTA.jsx
import styled from "@emotion/styled";

const HomeCTAContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: 100vw;
  background: ${({ theme }) => theme.colors.gray300};
  color: ${({ theme }) => theme.colors.primary};
`;

const HomeCTATitle = styled.h5`
  ${({ theme }) => theme.mixins.textH5}
`;

const HomeCTA = () => {
  return (
    <HomeCTAContainer>
      <HomeCTATitle>CTA</HomeCTATitle>
    </HomeCTAContainer>
  );
};

export default HomeCTA;
