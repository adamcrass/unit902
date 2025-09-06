import { ChakraProvider } from "@chakra-ui/react";
import { ThemeProvider } from "@emotion/react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ScrollProvider } from "./contexts/ScrollContext";
import { NavigationProvider } from "./contexts/NavigationContext";

import { system, emotionTheme } from "./theme";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Shop from "./pages/Shop";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

const App = () => {
  return (
    <AuthProvider>
      <ScrollProvider>
        <ChakraProvider value={system}>
          <ThemeProvider theme={emotionTheme}>
            <Router>
              <NavigationProvider>
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
                <Route
                  path="/shop"
                  element={
                    <ProtectedRoute>
                      <Shop />
                    </ProtectedRoute>
                  }
                />
                </Routes>
              </NavigationProvider>
            </Router>
          </ThemeProvider>
        </ChakraProvider>
      </ScrollProvider>
    </AuthProvider>
  );
};

export default App;
