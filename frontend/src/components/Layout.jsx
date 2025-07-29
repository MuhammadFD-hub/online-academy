import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function Layout() {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div
        style={{
          marginLeft: 60,
        }}
      >
        <Outlet />
      </div>
    </>
  );
}
