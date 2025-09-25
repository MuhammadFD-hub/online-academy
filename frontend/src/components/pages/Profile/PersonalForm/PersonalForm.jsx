import { useRef, useState } from "react";
import styles from "./PersonalForm.module.css";
import btnStyles from "../Button.module.css";
import inputStyles from "../ParaInput/ParaInput.module.css";
import EditIcon from "../EditIcon/EditIcon";
import InputEntry from "../InputEntry/InputEntry";
import { Spinner } from "react-bootstrap";
import LoadingBtn from "../LoadingBtn/LoadingBtn";
import UseStore from "../../../../stores/UseStore";
import ErrorLog from "../ErrorLog/ErrorLog";

const PersonalForm = () => {
  const token = localStorage.getItem("token");
  const personalForm = UseStore((state) => state.personalForm);
  const username = UseStore((state) => state.username);
  const setPersonalForm = UseStore((state) => state.setPersonalForm);
  const setUsername = UseStore((state) => state.setUsername);
  const fetchWithAuth = UseStore((s) => s.fetchWithAuth);
  const [editPersonal, setEditPersonal] = useState(false);
  const [personalFormLocal, setPersonalFormLocal] = useState({
    username: "",
    dateOfBirth: "",
    gender: "",
  });
  const [showNameErr, setShowNameErr] = useState(false);
  const [usernameErr, setUsernameErr] = useState("no error");
  const timeoutRef = useRef(null);

  function handleNull(globalForm) {
    return {
      dateOfBirth: globalForm.dateOfBirth ?? "",
      gender: convertToString(globalForm.gender),
    };
  }
  function handleEmptyStr(localForm) {
    return {
      dateOfBirth: localForm.dateOfBirth === "" ? null : localForm.dateOfBirth,
      username: localForm.username === "" ? null : localForm.username,
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
    const promises = [];

    const localName =
      personalFormLocal.username === "" ? null : personalFormLocal.username;
    if (localName !== username) {
      if (localName.length > 25) {
        setUsernameErr("username can't be longer than 25 chars.");
        setShowNameErr(true);
        return;
      }
      if (!isValidWordLen(localName)) return;

      const usernamePromise = fetchWithAuth(
        "http://localhost:5000/api/user/uploadUsername",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: localName,
          }),
        }
      )
        .then(async (res) => {
          if (res.ok) {
            setUsername(localName);
          } else {
            const data = await res.json();
            console.error("Username error:", data.error);
          }
        })
        .catch((error) => console.error("Username fetch error:", error));

      promises.push(usernamePromise);
    }

    if (
      personalFormLocal.dateOfBirth !== personalForm.dateOfBirth ||
      personalFormLocal.gender !== personalForm.gender
    ) {
      const form = handleEmptyStr(personalFormLocal);

      const infoPromise = fetchWithAuth(
        "http://localhost:5000/api/user/uploadUserInfo",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      )
        .then(async (res) => {
          if (res.ok) {
            setPersonalForm({
              gender: form.gender,
              dateOfBirth: form.dateOfBirth,
            });
          } else {
            const data = await res.json();
            console.error("UserInfo error:", data);
          }
        })
        .catch((error) => console.error("UserInfo fetch error:", error));

      promises.push(infoPromise);
    }

    await Promise.all(promises);

    setEditPersonal(false);
  }

  function cancelEdit() {
    setPersonalFormLocal({
      ...handleNull(personalForm),
      username: username ?? "",
    });
    setEditPersonal(false);
    setUsernameErr((prev) => prev.substring(0, 30));
    setShowNameErr(false);
  }
  function handleEdit() {
    setPersonalFormLocal({
      ...handleNull(personalForm),
      username: username ?? "",
    });
    setEditPersonal(true);
  }
  function isValidWordLen(value) {
    const words = value.trim().split(/\s+/).filter(Boolean);
    const longWord = words.find((w) => w.length > 10);
    if (longWord) {
      setUsernameErr(`"${longWord}" is longer than 10 chars.`);
      setShowNameErr(true);
      return false;
    }
    return true;
  }
  function handleFormChange(e) {
    const { name, value } = e.target;
    if (name === "username") {
      if (value.length > 25) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null; // reset
        setUsernameErr("username can't be longer than 25 chars.");
        setShowNameErr(true);
        return;
      }
      if (value.length > 10) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          timeoutRef.current = null;
          isValidWordLen(value);
        }, 400);
      } else {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
        setUsernameErr((prev) => prev.substring(0, 30));
        setShowNameErr(false);
      }
    }
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
                editPersonal ? personalFormLocal.username : username || "none"
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
      <div
        className={`${styles.errorSpacer} ${showNameErr || styles.scrollUp}`}
      ></div>
      <ErrorLog
        className={`${styles.errorLog}`}
        showError={showNameErr}
        error={usernameErr}
      />
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
