import React from "react";
import { createContext, useState } from "react";
export const loadingContext = createContext();

const loaderProvider = {};

function Democontext({ children }) {
  const [loading, setLoading] = useState(false);
  loaderProvider.loading = loading;
  loaderProvider.setLoading = setLoading;
  return (
    <loadingContext.Provider value={{ loading }}>
      {children}
    </loadingContext.Provider>
  );
}

export { Democontext, loaderProvider };
