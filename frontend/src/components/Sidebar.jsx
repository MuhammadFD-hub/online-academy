import { Button, Nav } from "react-bootstrap";
import { motion } from "framer-motion";
import { FaBars, FaBook, FaUser, FaSignOutAlt } from "react-icons/fa";
import SidebarItem from "./SidebarItem";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function Sidebar({ collapsed, setCollapsed }) {
  const sidebarWidth = collapsed ? 60 : 220;
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <>
      <motion.div
        animate={{ width: sidebarWidth }}
        transition={{ duration: 0.3 }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          backgroundColor: "#f1f3f5",
          paddingTop: "1rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
          zIndex: 1001,
        }}
      >
        <Button
          variant="light"
          className="mb-4 rounded-circle"
          onClick={() => setCollapsed(!collapsed)}
        >
          <FaBars />
        </Button>

        <Nav className="flex-column w-100 align-items-center">
          <SidebarItem
            icon={<FaBook />}
            label="Courses"
            collapsed={collapsed}
            onClick={() => navigate("/courses")}
          />
          <SidebarItem
            icon={<FaUser />}
            label="Dashboard"
            collapsed={collapsed}
            onClick={() => navigate("/dashboard")}
          />
        </Nav>

        <div className="mt-auto mb-3 w-100 text-center">
          <Button variant="outline-danger" className="w-75" onClick={logout}>
            <FaSignOutAlt />
            {!collapsed && <span className="ms-2">Logout</span>}
          </Button>
        </div>
      </motion.div>

      {!collapsed && (
        <motion.div
          onClick={() => setCollapsed(true)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "black",
            zIndex: 1000,
          }}
        />
      )}
    </>
  );
}
