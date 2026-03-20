import { Outlet } from "react-router";
import { Navigation } from "./Navigation";

export function Root() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <Navigation />
      <Outlet />
    </div>
  );
}
