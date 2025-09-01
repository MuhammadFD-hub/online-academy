import styles from "./ErrorLog.module.css";

const ErrorLog = ({ error, showError, className = "" }) => {
  return (
    <p
      className={`${className} ${showError ? styles.showError : ""} ${
        styles.errorLog
      }`}
    >
      {error}
    </p>
  );
};

export default ErrorLog;
