import { Nav, OverlayTrigger, Tooltip } from "react-bootstrap";

export default function SidebarItem({ icon, label, collapsed, onClick }) {
  if (collapsed) {
    return (
      <OverlayTrigger placement="right" overlay={<Tooltip>{label}</Tooltip>}>
        <Nav.Link
          onClick={onClick}
          className="w-100 px-3 py-2 d-flex align-items-center justify-content-start sidebar-item"
          style={{ transition: "background-color 0.2s" }}
        >
          <span className="me-2 fs-5">{icon}</span>
        </Nav.Link>
      </OverlayTrigger>
    );
  } else {
    return (
      <Nav.Link
        onClick={onClick}
        className="w-100 px-3 py-2 d-flex align-items-center justify-content-start sidebar-item"
        style={{ transition: "background-color 0.2s" }}
      >
        <span className="me-2 fs-5">{icon}</span>
        <span className="fw-semibold">{label}</span>
      </Nav.Link>
    );
  }
}
