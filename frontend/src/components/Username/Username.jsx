import UseStore from "../../stores/UseStore";
import styles from "./Username.module.css";

const Username = ({ classname, displayChars = 24 }) => {
  const username = UseStore((s) => s.username);
  return (
    <span className={`${classname} ${styles.username}`}>
      {username?.substring(0, displayChars) ?? "User"}
    </span>
  );
};

export default Username;
