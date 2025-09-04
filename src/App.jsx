
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

import Home from "./pages/Home"

const App = () => {

  return (
    <ChakraProvider value={defaultSystem}>
     <Router>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
     </Router>
    </ChakraProvider>
  )
}

export default App
