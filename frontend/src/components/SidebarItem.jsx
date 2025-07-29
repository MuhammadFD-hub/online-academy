import { Nav, OverlayTrigger, Tooltip } from "react-bootstrap";

export default function SidebarItem({ icon, label, collapsed, onClick }) {
  return (
    <Nav.Link
      onClick={onClick}
      className="w-100 px-3 py-2 d-flex align-items-center justify-content-start sidebar-item"
      style={{ transition: "background-color 0.2s" }}
    >
      <span className="me-2 fs-5">{icon}</span>

      <span
        className="fw-semibold sidebar-label"
        style={{
          opacity: collapsed ? 0 : 1,
          maxWidth: collapsed ? 0 : "100px",
          overflow: "hidden",
          transition: "ease 0.3s",
        }}
      >
        {label}
      </span>
    </Nav.Link>
  );
}
// }
