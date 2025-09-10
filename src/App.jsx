import { ChakraProvider } from "@chakra-ui/react";
import { ShopProvider } from "./contexts/ShopContext";
import { ThemeProvider } from "@emotion/react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ScrollProvider } from "./contexts/ScrollContext";
import { NavigationProvider } from "./contexts/NavigationContext";
import { AdminProvider } from "./contexts/AdminContext";
import { GlobalModalProvider } from "./contexts/GlobalModalContext";

import { system, emotionTheme } from "./theme";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Shop from "./pages/Shop";
import Admin from "./pages/Admin";

import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

const App = () => {
  return (
    <AuthProvider>
      <ScrollProvider>
        <ChakraProvider value={system}>
          <ThemeProvider theme={emotionTheme}>
            <ShopProvider>
              <Router>
                <NavigationProvider>
                  <GlobalModalProvider>
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
                      <Route
                        path="/admin/*"
                        element={
                          <ProtectedRoute>
                            <AdminProvider>
                              <Admin />
                            </AdminProvider>
                          </ProtectedRoute>
                        }
                      />
                    </Routes>
                  </GlobalModalProvider>
                </NavigationProvider>
              </Router>
            </ShopProvider>
          </ThemeProvider>
        </ChakraProvider>
      </ScrollProvider>
    </AuthProvider>
  );
};

export default App;
