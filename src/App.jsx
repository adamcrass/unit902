import { ChakraProvider } from "@chakra-ui/react";
import { ThemeProvider } from "@emotion/react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

import { system, emotionTheme } from "./theme";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

const App = () => {
  return (
    <AuthProvider>
      <ChakraProvider value={system}>
        <ThemeProvider theme={emotionTheme}>
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route 
                path="/login" 
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </Router>
        </ThemeProvider>
      </ChakraProvider>
    </AuthProvider>
  );
};

export default App;
