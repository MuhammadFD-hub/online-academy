import ParaInput from "../ParaInput/ParaInput";
import styles from "./InputEntry.module.css";

const InputEntry = ({
  toggle,
  name,
  label = false,
  labelClassName = `${styles.label} ${toggle ? styles.paraToInput : ""}`,
  InputClassName,
  ...props
}) => {
  return (
    <>
      {label && (
        <label htmlFor={name} className={labelClassName}>
          {label}
        </label>
      )}
      <ParaInput
        toggle={toggle}
        name={name}
        className={InputClassName}
        {...props}
      />
    </>
  );
};

export default InputEntry;
