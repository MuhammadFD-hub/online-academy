import { Spinner } from "react-bootstrap";
import styles from "./PageSpinner.module.css";

const PageSpinner = () => {
  return (
    <div className={styles.PageSpinner}>
      <Spinner variant="primary" animation="border" />
    </div>
  );
};

export default PageSpinner;
