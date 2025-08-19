import { useState } from "react";
import styles from "./PasswordForm.module.css";
import btnStyles from "../../Button.module.css";
import sharedStyles from "../Shared.module.css";
import EditIcon from "../../EditIcon/EditIcon";
import ErrorLog from "../ErrorLog/ErrorLog";
import InputEntry from "../../InputEntry/InputEntry";
import LoadingBtn from "../../LoadingBtn/LoadingBtn";

const PasswordForm = () => {
  const token = localStorage.getItem("token");
  const [editPassword, setEditPassword] = useState(false);
  const [form, setForm] = useState({});
  const [showOldPassErr, setShowOldPassErr] = useState(false);
  const [oldPassErr, setOldPassErr] = useState("example");
  const [showNewPassErr, setShowNewPassErr] = useState(false);
  const [NewPassErr, setNewPassErr] = useState("example");
  const [showRetypePassErr, setShowRetypePassErr] = useState(false);
  const [RetypePassErr, setRetypePassErr] = useState("example");

  function handleInputChange(e) {
    const { name, value } = e.target;

    setForm((prevForm) => ({ ...prevForm, [name]: value }));
    name === "newPassword" && setShowNewPassErr(false);
    name === "oldPassword" && setShowOldPassErr(false);
    name === "retypePassword" && setShowRetypePassErr(false);
  }
  function cancelEdit() {
    setForm({ oldPassword: "", newPassword: "", retypePassword: "" });
    setEditPassword(false);
    setShowNewPassErr(false);
    setShowOldPassErr(false);
    setShowRetypePassErr(false);
  }
  function handleIconClick() {
    if (editPassword) cancelEdit();
    else setEditPassword(true);
  }
  function handleOldPwBlur() {
    if (form.oldPassword === "") {
      setOldPassErr("Password is required.");
      setShowOldPassErr(true);
    }
  }
  function isValidPw() {
    if (!editPassword) return;
    const res = validatePassword(form.newPassword);
    if (!res.ok) {
      setNewPassErr(res.reason);
      setShowNewPassErr(true);
      return false;
    }
    return true;
  }
  function validatePassword(pw) {
    if (pw == null || pw === "") {
      return { ok: false, reason: "Password is required." };
    } else if (typeof pw !== "string") {
      return { ok: false, reason: "Password must be a string." };
    } else if (pw.length < 8) {
      return { ok: false, reason: "Too short (min 8 characters)." };
    } else if (pw.length > 128) {
      return { ok: false, reason: "Too long (max 128 characters)." };
    } else if (/\s/.test(pw)) {
      return { ok: false, reason: "Spaces are not allowed." };
    } else if (!/[a-z]/.test(pw)) {
      return { ok: false, reason: "Add a lowercase letter." };
    } else if (!/[A-Z]/.test(pw)) {
      return { ok: false, reason: "Add an uppercase letter." };
    } else if (!/\d/.test(pw)) {
      return { ok: false, reason: "Add a number." };
    } else if (!/[^A-Za-z0-9]/.test(pw)) {
      return { ok: false, reason: "Add a symbol (e.g. !@#$%)." };
    } else if (/(.)\1{2,}/.test(pw)) {
      return { ok: false, reason: "Too many repeated characters in a row." };
    } else if (/password|12345|qwerty|letmein|abc123/i.test(pw)) {
      return { ok: false, reason: "Password is too common/easily guessed." };
    } else return { ok: true, reason: "Strong password." };
  }
  function pwMatch() {
    if (form.retypePassword !== form.newPassword) {
      setRetypePassErr("Password don't match");
      setShowRetypePassErr(true);
    }
  }
  async function handleFormSubmit() {
    try {
      const res = await fetch("http://localhost:5000/api/user/updatePassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          oldPassword: form.oldPassword,
          newPassword: form.newPassword,
        }),
      });
      const data = await res.json();
      if (res.ok) cancelEdit();
      else {
        setForm((prevForm) => ({ ...prevForm, oldPassword: "" }));
        setOldPassErr(data.error || "Something went wrong");
        setShowOldPassErr(true);
      }
    } catch (error) {
      console.error(error.error);
    }
  }
  return (
    <form className={`${styles.form}`} onSubmit={(e) => e.preventDefault()}>
      <label className={`${sharedStyles.label}`}>Password</label>
      <div className={`${sharedStyles.inputFlex} ${styles.inputFlex}`}>
        <InputEntry
          onChange={handleInputChange}
          placeholder={editPassword ? "old password" : "••••••"}
          onBlur={handleOldPwBlur}
          type="password"
          name={editPassword ? "oldPassword" : "password"}
          className={` ${sharedStyles.adjustInput}`}
          value={form.oldPassword}
          toggle={editPassword}
        />
        <button
          onClick={(e) => {
            e.preventDefault();
            setEditPassword(true);
          }}
          className={` ${
            editPassword ? sharedStyles.btnHidden : sharedStyles.btnShow
          }  ${sharedStyles.hideOnSmallView} ${sharedStyles.btn} ${
            btnStyles.editBtn
          } ${btnStyles.defaultBtn}`}
        >
          edit
        </button>
        <EditIcon
          handleClick={handleIconClick}
          className={`${sharedStyles.showOnSmallView} ${styles.editIcon} `}
          active={editPassword}
        />
      </div>
      <ErrorLog error={oldPassErr} showError={showOldPassErr} />
      <div className={`${styles.formFlex}`}>
        <div
          className={`${editPassword ? "" : styles.scrollUp} ${
            styles.scrollItems
          }`}
        ></div>
        <InputEntry
          onChange={handleInputChange}
          placeholder="new password"
          onBlur={isValidPw}
          name="newPassword"
          InputClassName={`${editPassword ? "" : styles.hideItem} ${
            sharedStyles.adjustInput
          }`}
          value={form.newPassword}
          label={"New Password"}
          labelClassName={`${editPassword ? "" : styles.hideItem} ${
            styles.passwordLabel
          }`}
        />
        <ErrorLog error={NewPassErr} showError={showNewPassErr} />
        <InputEntry
          onChange={handleInputChange}
          onBlur={pwMatch}
          placeholder="retype password"
          name="retypePassword"
          InputClassName={`${editPassword ? "" : styles.hideItem} ${
            sharedStyles.adjustInput
          }`}
          value={form.retypePassword}
          label={"Retype New Password"}
          labelClassName={`${editPassword ? "" : styles.hideItem} ${
            styles.passwordLabel
          }`}
        />

        <ErrorLog error={RetypePassErr} showError={showRetypePassErr} />
        <div className={`${styles.btnWrap}`}>
          <LoadingBtn
            className={`${editPassword ? "" : styles.hideItem}`}
            onClick={handleFormSubmit}
            label={"save"}
          />
          <button
            onClick={(e) => {
              e.preventDefault();
              cancelEdit();
            }}
            className={`${editPassword ? "" : styles.hideItem} ${
              btnStyles.defaultBtn
            } ${btnStyles.secondaryBtn} `}
          >
            cancel
          </button>
        </div>
      </div>
    </form>
  );
};

export default PasswordForm;
