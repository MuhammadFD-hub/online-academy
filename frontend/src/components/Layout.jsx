import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function Layout() {
  const [collapsed, setCollapsed] = useState(true);
  const sidebarWidth = collapsed ? 60 : 220;

  return (
    <>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div
        style={{
          marginLeft: sidebarWidth,
          padding: "1rem",
          transition: "margin-left 0.3s ease",
        }}
      >
        <Outlet />
      </div>
    </>
  );
}
