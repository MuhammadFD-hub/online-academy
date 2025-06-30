import { Link, Outlet, useNavigate } from "react-router-dom";
import { Navbar, Container, Nav, NavDropdown, Image } from "react-bootstrap";
import useAuth from "../hooks/useAuth";
import { motion } from "framer-motion";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, type: "spring" }}
      >
        <Navbar bg="light" expand="lg" className="shadow-sm px-3 py-2 mb-4">
          <Container>
            <Navbar.Brand
              as={Link}
              to="/"
              className="fw-bold text-primary fs-4 d-flex align-items-center"
              style={{ letterSpacing: "0.5px" }}
            >
              Online Academy
            </Navbar.Brand>

            <Navbar.Toggle aria-controls="main-navbar" />
            <Navbar.Collapse id="main-navbar">
              <Nav className="me-auto">{/* Future links */}</Nav>

              <Nav className="align-items-center">
                {user ? (
                  <NavDropdown
                    align="end"
                    id="user-dropdown"
                    title={
                      <span className="d-flex align-items-center">
                        <Image
                          src={user.profilePic || "/default-avatar.png"}
                          roundedCircle
                          width={32}
                          height={32}
                          className="me-2 border border-secondary-subtle shadow-sm"
                          alt="Profile"
                        />
                        <span className="fw-semibold">
                          {user.name || "User"}
                        </span>
                      </span>
                    }
                  >
                    <NavDropdown.Item onClick={handleLogout}>
                      Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                ) : (
                  <>
                    <Nav.Link
                      as={Link}
                      to="/login"
                      className="fw-semibold hover-underline"
                    >
                      Login
                    </Nav.Link>
                    <Nav.Link
                      as={Link}
                      to="/signup"
                      className="fw-semibold hover-underline"
                    >
                      Signup
                    </Nav.Link>
                  </>
                )}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </motion.div>
      <Outlet />
    </>
  );
}
