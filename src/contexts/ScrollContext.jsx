// context/ScrollContext.js
import React, { createContext, useContext } from "react";
import useScroll from "../hooks/useScroll";

const ScrollContext = createContext();

export const ScrollProvider = ({ children }) => {
  // Since useScroll returns a boolean, we need to create an object with isScrolled property
  const isScrolled = useScroll(10);

  // Pass the value as an object with isScrolled property
  return (
    <ScrollContext.Provider value={{ isScrolled }}>
      {children}
    </ScrollContext.Provider>
  );
};

export const useScrollContext = () => {
  return useContext(ScrollContext);
};
