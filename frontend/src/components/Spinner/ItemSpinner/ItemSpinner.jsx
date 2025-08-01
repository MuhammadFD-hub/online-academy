import { Spinner } from "react-bootstrap";
import styles from "./ItemSpinner.module.css";

const ItemSpinner = () => {
  return (
    <div className={styles.ItemSpinner}>
      <Spinner variant="primary" animation="border" />
    </div>
  );
};

export default ItemSpinner;
