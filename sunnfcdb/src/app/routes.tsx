import { createBrowserRouter, Navigate } from "react-router-dom";
import { Root } from "./components/Root";
import { Home } from "./components/Home";
import { Data } from "./components/Data";
import { News } from "./components/News";
import { NewsDetail } from "./components/NewsDetail";
import { Events } from "./components/Events";
import { Tools } from "./components/Tools";
import { Contact } from "./components/Contact";
import { Admin } from "./components/Admin";
import { Login } from "./components/Login";
import { ChangelogDetail } from "./components/ChangelogDetail";
import { NotFound } from "./components/NotFound";
import { useState, createContext, useContext, ReactNode } from "react";
import JBrowser from "../../../packages/ui/src/JBrowser";

interface User {
  username: string;
  is_staff: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  return useContext(AuthContext);
}

function ProtectedRoute({ children }: { children: ReactNode }) {
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

function AdminWrapper() {
  return (
    <ProtectedRoute>
      <Admin />
    </ProtectedRoute>
  );
}

function LoginWrapper() {
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  
  if (user) {
    return <Navigate to="/admin" replace />;
  }
  
  return <Login />;
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "data", Component: Data },
      { path: "news", Component: News },
      { path: "news/:id", Component: NewsDetail },
      { path: "events", Component: Events },
      { path: "tools", Component: Tools },
      { path: "contact", Component: Contact },
      { path: "login", Component: LoginWrapper },
      { path: "admin", Component: AdminWrapper },
      { path: "changelog/:id", Component: ChangelogDetail },
      { path: "*", Component: NotFound },
      {path: "tool/jbrowse", Component: JBrowser}
    ],
  },
]);
