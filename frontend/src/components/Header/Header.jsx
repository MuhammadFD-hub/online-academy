import { Link } from "react-router-dom";
import { Navbar, Container, Image, Dropdown, Nav } from "react-bootstrap";
import { motion } from "framer-motion";
import { FiMoreVertical } from "react-icons/fi";
import styles from "./Header.module.css";
import { useEffect, useRef, useState } from "react";
import Username from "../Username/Username";
import UseStore from "../../stores/UseStore";
import getCloudUrl from "../getCloudUrl";

export default function Header() {
  const logout = UseStore((s) => s.logout);
  const user = UseStore((s) => s.user);
  const pfpCloudData = UseStore((s) => s.pfpCloudData);
  const [showMenu, setShowMenu] = useState(false);
  const dropdownRef = useRef(null);
  const menuBtnRef = useRef(null);
  useEffect(() => {
    if (!showMenu) return;

    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !menuBtnRef.current.contains(event.target)
      )
        setShowMenu(false);
    }

    document.addEventListener("pointerdown", handleClickOutside);
    return () => {
      document.removeEventListener("pointerdown", handleClickOutside);
    };
  }, [showMenu]);
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, type: "spring" }}
    >
      <Navbar className={`shadow-sm px-3 py-2 ${styles.header}`}>
        <Container>
          <Navbar.Brand
            as={Link}
            to="/"
            className={`fw-bold text-primary fs-4 d-flex align-items-center ${styles.Brand}`}
          >
            Online Academy
          </Navbar.Brand>

          <Dropdown align="end" className="ms-auto" show={true}>
            <div className="d-flex gap-1 align-items-center justify-content-center">
              {user && (
                <Nav.Link
                  className={`${styles.pfpLink}`}
                  as={Link}
                  to="/profile"
                >
                  <Image
                    src={
                      getCloudUrl(
                        pfpCloudData?.public_id,
                        pfpCloudData?.format
                      ) || "/default-pfp.svg"
                    }
                    roundedCircle
                    width={32}
                    height={32}
                    alt="Profile"
                  />
                </Nav.Link>
              )}
              <button
                className={`btn btn-link border-0 ${styles.menuButton}`}
                onClick={() => setShowMenu(!showMenu)}
                ref={menuBtnRef}
              >
                <FiMoreVertical size={24} />
              </button>
            </div>
            <Dropdown.Menu
              className={`${showMenu && styles.showMenu} ${
                styles.dropdownMenu
              } border-0 py-2`}
              ref={dropdownRef}
            >
              {user ? (
                <>
                  <h3 className={`${styles.dropdownTitle}`}>
                    <Username
                      classname={`px-3 py-1 ${styles.username}`}
                      displayChars={15}
                    />
                  </h3>
                  <Dropdown.Divider />
                  <Dropdown.Item
                    as={Link}
                    to="/profile"
                    className={`${styles.dropdownItem}`}
                    onClick={() => setShowMenu(false)}
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
                    onClick={() => {
                      setShowMenu(false);
                      logout();
                    }}
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
                    onClick={() => setShowMenu(false)}
                  >
                    Login
                  </Dropdown.Item>
                  <Dropdown.Item
                    as={Link}
                    to="/signup"
                    className={`${styles.dropdownItem}`}
                    onClick={() => setShowMenu(false)}
                  >
                    Signup
                  </Dropdown.Item>
                </>
              )}
            </Dropdown.Menu>
          </Dropdown>
        </Container>
      </Navbar>
    </motion.div>
  );
}
