import { RouterProvider } from "react-router";
import { router, AuthContext } from "./routes";
import { useState, ReactNode } from "react";

function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ username: string; is_staff: boolean } | null>(() => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  });

  const login = (userData: { username: string; is_staff: boolean }) => {
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
