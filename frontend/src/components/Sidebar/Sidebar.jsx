import { Button, Nav } from "react-bootstrap";
import { FaBook, FaSignOutAlt } from "react-icons/fa";
import SidebarItem from "./SidebarItem/SidebarItem";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import styles from "./Sidebar.module.css";
import UseStore from "../../stores/UseStore";
import Hamburger from "./Hamburger/Hamburger";
import { GiProgression } from "react-icons/gi";
export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(true);
  const navigate = useNavigate();
  const logout = UseStore((s) => s.logout);
  return (
    <>
      <div
        className={`${collapsed || styles.expand} 
          ${styles.sidebar}`}
      >
        <Hamburger collapsed={collapsed} setCollapsed={setCollapsed} />
        <Nav className={`py-3 flex-column ${collapsed && styles.hideOnSmall}`}>
          <SidebarItem
            icon={<FaBook />}
            label="Courses"
            collapsed={collapsed}
            onClick={() => navigate("/courses")}
          />
          <SidebarItem
            icon={<GiProgression />}
            label="Progress"
            collapsed={collapsed}
            onClick={() => navigate("/dashboard")}
          />
        </Nav>
        <div
          className={`mt-auto mb-3  text-center ${
            collapsed && styles.hideOnSmall
          }`}
        >
          <Button
            className={`${styles.logoutBtn}`}
            variant="outline-danger"
            onClick={logout}
          >
            <FaSignOutAlt />
            {
              <span
                className={`ms-2 ${collapsed && styles.logoutLabelHidden} 
                ${styles.logoutLabel}`}
              >
                Logout
              </span>
            }
          </Button>
        </div>
      </div>
      <div
        onClick={() => setCollapsed(true)}
        className={`${styles.overlay} ${
          collapsed ? styles.overlayHidden : styles.overlayShown
        }`}
      />
    </>
  );
}
