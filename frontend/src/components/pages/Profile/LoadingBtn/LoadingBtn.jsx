import styles from "./LoadingBtn.module.css";
import { useState } from "react";
import btnStyles from "../Button.module.css";
import { Spinner } from "react-bootstrap";

const LoadingBtn = ({ label, onClick, className, ...props }) => {
  const [loading, setLoading] = useState(false);

  return (
    <button
      onClick={async (e) => {
        e.preventDefault();
        setLoading(true);
        await onClick();
        setLoading(false);
      }}
      className={`${className} ${btnStyles.primaryBtn} ${btnStyles.defaultBtn}`}
      {...props}
    >
      {loading ? (
        <Spinner animation="border" className={` ${styles.spinner}`} />
      ) : (
        label
      )}
    </button>
  );
};
export default LoadingBtn;
