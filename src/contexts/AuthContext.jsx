import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("hospital-user");
    const storedToken = localStorage.getItem("hospital-token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }

    setLoading(false);
  }, []);

  const saveAuthData = (data) => {
    localStorage.setItem("hospital-token", data.token);
    localStorage.setItem("hospital-user", JSON.stringify(data.user));

    setToken(data.token);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem("hospital-token");
    localStorage.removeItem("hospital-user");

    setToken(null);
    setUser(null);
  };

  const authInfo = {
    user,
    token,
    loading,
    saveAuthData,
    logout,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;