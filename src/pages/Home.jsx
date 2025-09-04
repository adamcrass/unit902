// src/pages/Home.jsx
import styled from "@emotion/styled"
import { Button, HStack, Text } from "@chakra-ui/react"

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  color: white;
`;

const Home = () => {

  return (
    <HomeContainer>
      <Text fontSize="4xl">Home</Text>
      <HStack>
        <Button onClick={() => console.log("click")}>Button</Button>
      </HStack>
    </HomeContainer>
  )
}

export default Home
