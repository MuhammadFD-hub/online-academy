import styles from "./ErrorLog.module.css";

const ErrorLog = ({ error, showError }) => {
  return (
    <p className={`${showError ? styles.showError : ""} ${styles.errorLog}`}>
      {error}
    </p>
  );
};

export default ErrorLog;
