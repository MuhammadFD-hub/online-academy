import { Button } from "react-bootstrap";
import styles from "./Hambuger.module.css";
import { FaBars } from "react-icons/fa";
const Hamburger = ({ setCollapsed, collapsed }) => {
  return (
    <Button
      variant="light"
      className={` ${styles.hamburger}`}
      style={{ opacity: 1 }}
      onClick={() => setCollapsed(!collapsed)}
    >
      <FaBars />
    </Button>
  );
};

export default Hamburger;
