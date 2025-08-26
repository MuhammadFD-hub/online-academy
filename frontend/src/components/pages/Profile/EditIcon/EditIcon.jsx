import styles from "./EditIcon.module.css";
import btnStyles from "../Button.module.css";
import { BsPen } from "react-icons/bs";
import { MdClose } from "react-icons/md";

const EditIcon = ({ handleClick, className, active = false, children }) => {
  return (
    <div
      className={`${className} ${styles.editIcon} ${
        active ? styles.closeBtn : btnStyles.editBtn
      }`}
      onClick={handleClick}
    >
      {children ? (
        children
      ) : !active ? (
        <BsPen size={"100%"} />
      ) : (
        <MdClose size={"100%"} />
      )}
    </div>
  );
};

export default EditIcon;
