import { useState } from "react";
import styles from "./PersonalForm.module.css";
import btnStyles from "../Button.module.css";
import inputStyles from "../ParaInput/ParaInput.module.css";
import EditIcon from "../EditIcon/EditIcon";
import InputEntry from "../InputEntry/InputEntry";
import { Spinner } from "react-bootstrap";
import LoadingBtn from "../LoadingBtn/LoadingBtn";
import UseStore from "../../../../stores/UseStore";

const PersonalForm = () => {
  const token = localStorage.getItem("token");
  const [editPersonal, setEditPersonal] = useState(false);
  const personalForm = UseStore((state) => state.personalForm);
  const setPersonalForm = UseStore((state) => state.setPersonalForm);
  const [personalFormLocal, setPersonalFormLocal] = useState({
    username: "",
    dateOfBirth: "",
    gender: "",
  });

  function handleNull(globalForm) {
    return {
      username: globalForm.username ?? "",
      dateOfBirth: globalForm.dateOfBirth ?? "",
      gender: convertToString(globalForm.gender),
    };
  }
  function handleEmptyStr(localForm) {
    return {
      username: localForm.username === "" ? null : localForm.username,
      dateOfBirth: localForm.dateOfBirth === "" ? null : localForm.dateOfBirth,
      gender: convertString(localForm.gender),
    };
  }
  function convertString(value) {
    if (value === "") return null;
    else if (value === "true") return true;
    else return false;
  }
  function convertToString(value) {
    if (value === null) return "";
    else if (value) return "true";
    else return "false";
  }
  async function handleFormSubmit() {
    if (
      personalFormLocal.dateOfBirth !== personalForm.dateOfBirth ||
      personalFormLocal.username !== personalForm.username ||
      personalFormLocal.gender !== personalForm.gender
    ) {
      try {
        const form = handleEmptyStr(personalFormLocal);
        const res = await fetch(
          "http://localhost:5000/api/user/uploadUserInfo",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(form),
          }
        );
        if (res.ok) {
          setEditPersonal(false);
          setPersonalForm(form);
        } else {
          const data = await res.json();
        }
      } catch (error) {
        console.error(error.error);
      }
    }
  }
  function cancelEdit() {
    setPersonalFormLocal(handleNull(personalForm));
    setEditPersonal(false);
  }
  function handleEdit() {
    setPersonalFormLocal(handleNull(personalForm));
    setEditPersonal(true);
  }
  function handleFormChange(e) {
    const { name, value } = e.target;
    setPersonalFormLocal((prevForm) => ({ ...prevForm, [name]: value }));
  }

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <h4>
        <strong className={`fw-semibold`}>Personal Info</strong>
      </h4>

      <div className={`${styles.personalInfoGrid}`}>
        {personalForm ? (
          <>
            <EditIcon
              handleClick={editPersonal ? cancelEdit : handleEdit}
              active={editPersonal}
            />

            <InputEntry
              label="Username"
              onChange={handleFormChange}
              name="username"
              value={
                editPersonal
                  ? personalFormLocal.username
                  : personalForm.username || "none"
              }
              toggle={editPersonal}
              placeholder={"enter username"}
            />

            <label
              htmlFor="gender"
              className={`${editPersonal ? inputStyles.paraToInput : ""}`}
            >
              <b>Gender</b>
            </label>
            <select
              onChange={handleFormChange}
              name="gender"
              id="gender"
              className={`${
                editPersonal ? inputStyles.paraToInput : inputStyles.inputToPara
              } ${inputStyles.inputDefault} `}
              value={
                editPersonal
                  ? personalFormLocal.gender
                  : convertToString(personalForm.gender) || "none"
              }
            >
              <option value={""}>none</option>
              <option value={true}>Male</option>
              <option value={false}>Female</option>
            </select>

            <InputEntry
              onChange={handleFormChange}
              name="dateOfBirth"
              type="date"
              label="DoB"
              value={
                editPersonal
                  ? personalFormLocal.dateOfBirth
                  : personalForm.dateOfBirth || "none"
              }
              toggle={editPersonal}
            />
          </>
        ) : (
          <Spinner />
        )}
      </div>
      <LoadingBtn
        onClick={handleFormSubmit}
        label={"save"}
        className={` ${
          editPersonal ? btnStyles.showBtn : btnStyles.hiddenBtn
        } `}
      />
      <button
        onClick={cancelEdit}
        className={`${btnStyles.defaultBtn} ${btnStyles.secondaryBtn}  ${
          editPersonal ? btnStyles.showBtn : btnStyles.hiddenBtn
        }`}
      >
        cancel
      </button>
    </form>
  );
};

export default PersonalForm;
