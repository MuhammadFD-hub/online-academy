import { Nav } from "react-bootstrap";
import styles from "./SidebarItem.module.css";

export default function SidebarItem({ icon, label, collapsed, onClick }) {
  return (
    <Nav.Link
      onClick={onClick}
      className="w-100 px-3 py-2 d-flex align-items-center justify-content-start sidebar-item"
    >
      <span className="me-2 fs-5">{icon}</span>

      <span
        className={`fw-semibold sidebar-label ${
          collapsed ? styles.labelHidden : styles.label
        }`}
      >
        {label}
      </span>
    </Nav.Link>
  );
}
// }
