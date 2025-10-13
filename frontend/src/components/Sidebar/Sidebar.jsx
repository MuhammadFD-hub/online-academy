import { Button, Nav } from "react-bootstrap";
import { FaBars, FaBook, FaUser, FaSignOutAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import SidebarItem from "./SidebarItem/SidebarItem";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "./Sidebar.module.css";
import UseStore from "../../stores/UseStore";
import Hamburger from "./Hamburger/Hamburger";

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
  const logout = UseStore((s) => s.logout);
  return (
    <>
      <motion.div
        transition={{ duration: 0.5, type: "spring" }}
        animate={{ x: 0, width: collapsed ? (smallSidebar ? 40 : 60) : 220 }}
        initial={{ x: -300 }}
        className={`
          ${collapsed && smallSidebar && styles.hideSidebar} 
          ${styles.sidebar}`}
      >
        <Hamburger collapsed={collapsed} setCollapsed={setCollapsed} />
        <Nav
          className={`py-3 flex-column ${
            collapsed && smallSidebar && styles.overlayHidden
          }`}
        >
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
        <div
          className={`mt-auto mb-3  text-center ${
            collapsed && smallSidebar && styles.overlayHidden
          }`}
        >
          <Button
            className={`${styles.logoutBtn}`}
            variant="outline-danger"
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
