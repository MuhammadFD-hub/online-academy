import { MdCheck } from "react-icons/md";
import EditIcon from "../../../EditIcon/EditIcon";
import { useState } from "react";
import styles from "./LoadingIcon.module.css";
import { Spinner } from "react-bootstrap";

const LoadingIcon = ({ className, onClick }) => {
  const [loading, setLoading] = useState(false);
  const handleClick = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onClick();
    setLoading(false);
  };
  return (
    <EditIcon
      className={className}
      handleClick={handleClick}
      children={
        loading ? (
          <Spinner animation="border" className={` ${styles.spinner}`} />
        ) : (
          <MdCheck size={"100%"} />
        )
      }
    />
  );
};

export default LoadingIcon;
