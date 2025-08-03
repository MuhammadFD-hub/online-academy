import { Button, Nav } from "react-bootstrap";
import { FaBars, FaBook, FaUser, FaSignOutAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import SidebarItem from "./SidebarItem/SidebarItem";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useEffect, useState } from "react";
import styles from "./Sidebar.module.css";

export default function Sidebar() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  let smallSidebar;
  if (windowWidth < 562) {
    smallSidebar = true;
  } else smallSidebar = false;

  const [collapsed, setCollapsed] = useState(true);
  const navigate = useNavigate();
  const { logout } = useAuth();
  return (
    <>
      <motion.div
        transition={{ duration: 0.5, type: "spring" }}
        animate={{ x: 0, width: collapsed ? (smallSidebar ? 40 : 60) : 220 }}
        initial={{ x: -300 }}
        className={`${styles.sidebar}`}
      >
        <Button
          variant="light"
          className={` ${styles.hamburgers}`}
          onClick={() => setCollapsed(!collapsed)}
        >
          <FaBars />
        </Button>
        <Nav className="py-3 flex-column">
          <SidebarItem
            icon={
              <FaBook className={`${smallSidebar ? styles.smallIcon : ""}`} />
            }
            label="Courses"
            collapsed={collapsed}
            onClick={() => navigate("/courses")}
          />
          <SidebarItem
            icon={
              <FaUser className={`${smallSidebar ? styles.smallIcon : ""}`} />
            }
            label="Dashboard"
            collapsed={collapsed}
            onClick={() => navigate("/dashboard")}
          />
        </Nav>
        <div className="mt-auto mb-3  text-center">
          <Button
            variant="outline-danger"
            className={`${styles.logoutBtn}`}
            onClick={logout}
          >
            <FaSignOutAlt
              className={`${smallSidebar ? styles.smallIcon : ""}`}
            />
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
        className={`${styles.overlay} ${
          collapsed ? styles.overlayHidden : styles.overlayShown
        }`}
      />
    </>
  );
}
