import styles from "./AccountInfo.module.css";
import EmailForm from "./EmailForm/EmailForm";
import PasswordForm from "./PasswordForm/PasswordForm";

const AccountInfo = () => {
  return (
    <>
      <h4>
        <strong className="fw-semibold">Account Info</strong>
      </h4>
      <div className={`${styles.accountInfoGrid}`}>
        <EmailForm />
        <PasswordForm />
      </div>
    </>
  );
};
export default AccountInfo;
