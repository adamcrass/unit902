import { ChakraProvider } from "@chakra-ui/react";
import { ThemeProvider } from "@emotion/react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { system, emotionTheme } from "./theme";
import Home from "./pages/Home";

const App = () => {
  return (
    <ChakraProvider value={system}>
      <ThemeProvider theme={emotionTheme}>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </ChakraProvider>
  );
};

export default App;
