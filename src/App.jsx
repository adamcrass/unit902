import { ChakraProvider } from "@chakra-ui/react";
import { ThemeProvider } from "@emotion/react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthContextProvider } from "./context/AuthContext";

import { system, emotionTheme } from "./theme";
import Home from "./pages/Home";
import Login from "./pages/Login";

const App = () => {
  return (
    <AuthContextProvider>
      <ChakraProvider value={system}>
        <ThemeProvider theme={emotionTheme}>
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </Router>
        </ThemeProvider>
      </ChakraProvider>
    </AuthContextProvider>
  );
};

export default App;
