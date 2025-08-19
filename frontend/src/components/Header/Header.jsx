import { Link } from "react-router-dom";
import { Navbar, Container, Image, Dropdown } from "react-bootstrap";
import { motion } from "framer-motion";
import { FiMoreVertical } from "react-icons/fi";
import styles from "./Header.module.css";
import useAuth from "../../hooks/useAuth";
import { useState } from "react";

export default function Header() {
  const { user, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, type: "spring" }}
    >
      <Navbar className={`shadow-sm px-3 py-2   ${styles.header}`}>
        <Container>
          <Navbar.Brand
            as={Link}
            to="/"
            className={`fw-bold text-primary fs-4 d-flex align-items-center ${styles.Brand}`}
          >
            Online Academy
          </Navbar.Brand>

          <Dropdown
            align="end"
            className="ms-auto"
            show={showMenu}
            onToggle={setShowMenu}
          >
            <button
              className={`btn btn-link px-1 py-1 border-0 ${styles.menuButton}`}
              onClick={() => setShowMenu(!showMenu)}
            >
              {user && (
                <Image
                  src={user.profilePic || "/default-avatar.png"}
                  roundedCircle
                  width={32}
                  height={32}
                  className="me-2 border border-secondary-subtle shadow-sm"
                  alt="Profile"
                />
              )}
              <FiMoreVertical size={24} />
            </button>

            {showMenu && (
              <Dropdown.Menu className={`border-0 p-2 ${styles.dropdownMenu}`}>
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {user ? (
                    <>
                      <div
                        className={`px-3 py-1 fw-semibold ${styles.dropdownTitle}`}
                      >
                        {user.name || "User"}
                      </div>
                      <Dropdown.Divider />
                      <Dropdown.Item
                        as={Link}
                        to="/profile"
                        className={`${styles.dropdownItem}`}
                      >
                        Profile
                      </Dropdown.Item>
                      {/* <Dropdown.Item
                          as={Link}
                          to="/settings"
                          className={`${styles.dropdownItem}`}
                        >
                          Settings
                        </Dropdown.Item> */}
                      <Dropdown.Divider />
                      <Dropdown.Item
                        as={Link}
                        to="/login"
                        onClick={logout}
                        className={`${styles.dropdownItem}`}
                      >
                        Logout
                      </Dropdown.Item>
                    </>
                  ) : (
                    <>
                      <Dropdown.Item
                        as={Link}
                        to="/login"
                        className={`${styles.dropdownItem}`}
                      >
                        Login
                      </Dropdown.Item>
                      <Dropdown.Item
                        as={Link}
                        to="/signup"
                        className={`${styles.dropdownItem}`}
                      >
                        Signup
                      </Dropdown.Item>
                    </>
                  )}
                </motion.div>
              </Dropdown.Menu>
            )}
          </Dropdown>
        </Container>
      </Navbar>
    </motion.div>
  );
}
