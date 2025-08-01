import { Button, Nav } from "react-bootstrap";
import { motion } from "framer-motion";
import { FaBars, FaBook, FaUser, FaSignOutAlt } from "react-icons/fa";
import SidebarItem from "./SidebarItem/SidebarItem";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useState } from "react";
import styles from "./Sidebar.module.css";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(true);
  const sidebarWidth = collapsed ? 60 : 220;
  const navigate = useNavigate();
  const { logout } = useAuth();
  return (
    <>
      <motion.div
        animate={{ width: sidebarWidth }}
        transition={{ duration: 0.3 }}
        className={`${styles.sidebar}`}
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
          <Button
            variant="outline-danger"
            className={`w-75 ${styles.logoutBtn}`}
            onClick={logout}
          >
            <FaSignOutAlt />
            {
              <span
                className={`ms-2 ${collapsed ? styles.logoutLabelHidden : ""} 
                ${styles.logoutLabel}`}
              >
                Logout
              </span>
            }
          </Button>
        </div>
      </motion.div>
      <div
        onClick={() => setCollapsed(true)}
        className={`${collapsed ? styles.overlayHidden : ""} ${styles.overlay}`}
      />
    </>
  );
}
