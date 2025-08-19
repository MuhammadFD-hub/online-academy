import styles from "./ParaInput.module.css";

const ParaInput = ({
  toggle = true,
  name = "",
  className = "",
  ...inputProps
}) => {
  return (
    <input
      name={name}
      id={name}
      className={`${className} ${
        toggle ? styles.paraToInput : styles.inputToPara
      } ${styles.inputDefault}`}
      {...inputProps}
      required
    />
  );
};

export default ParaInput;
