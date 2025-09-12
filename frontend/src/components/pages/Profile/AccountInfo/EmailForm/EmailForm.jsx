import { useState } from "react";
import styles from "./EmailForm.module.css";
import btnStyles from "../../Button.module.css";
import sharedStyles from "../Shared.module.css";
import EditIcon from "../../EditIcon/EditIcon";
import ErrorLog from "../../ErrorLog/ErrorLog";
import InputEntry from "../../InputEntry/InputEntry";
import LoadingBtn from "../../LoadingBtn/LoadingBtn";
import UseStore from "../../../../../stores/UseStore";

const EmailForm = () => {
  const setUser = UseStore((s) => s.setUser);
  const user = UseStore((s) => s.user);

  const token = localStorage.getItem("token");
  const [editEmail, setEditEmail] = useState(false);
  const [otp, setOtp] = useState("");
  const [verify, setVerify] = useState(false);
  const [email, setEmail] = useState("");
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState("");

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  function handleEditClick() {
    if (!editEmail) setEditEmail(true);
    else cancelOtpVerify();
  }
  function handleEmailChange(e) {
    const { value } = e.target;
    setEmail(value);
    setShowError(false);
  }
  function handleOtpChange(e) {
    const { value } = e.target;
    if (!/^[0-9]+$/.test(value) && value !== "") {
      setError("Please enter an Integer");
      setShowError(true);
      setOtp(value);
      return;
    }
    setOtp(value);
    setShowError(false);
  }
  function handleEmailSubmit() {
    if (!emailRegex.test(email)) {
      setError("Please enter valid email");
      setShowError(true);
      return;
    }
    if (email === user.email) {
      setError("Already using this email");
      setShowError(true);
      return;
    }
    console.log("Valid email:", email);
    setVerify(true);
  }
  async function handleOtpSubmit() {
    setShowError(false);
    if (otp.includes(".")) {
      setError("Please remove decimal points");
      setShowError(true);
      return;
    }

    if (otp.length !== 6) {
      setError("Please type a 6-digit number");
      setShowError(true);
      return;
    }

    if (otp === "111111") {
      try {
        const res = await fetch("http://localhost:5000/api/user/updateEmail", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ oldEmail: user.email, newEmail: email }),
        });
        const data = await res.json();
        if (res.ok) {
          setUser((prevUser) => ({ ...prevUser, email: email }));
          const { userId, exp } = JSON.parse(localStorage.getItem("user"));
          localStorage.setItem("user", JSON.stringify({ email, userId, exp }));
          cancelOtpVerify();
        } else {
          setVerify(false);
          setOtp("");
          setEmail("");
          setError(data.error || "Something went wrong");
          setShowError(true);
        }
      } catch (error) {
        console.error(error.error);
      }
    } else {
      setError("Invalid OTP");
      setShowError(true);
    }
  }
  function cancelOtpVerify() {
    setEditEmail(false);
    setVerify(false);
    setShowError(false);
    setOtp("");
    setEmail("");
  }
  return (
    <>
      <form
        className={`${sharedStyles.form}`}
        onSubmit={(e) => e.preventDefault()}
      >
        <label
          htmlFor={verify ? "otp" : "email"}
          className={`${sharedStyles.label} ${
            editEmail ? "" : sharedStyles.noPointer
          }`}
        >
          {verify ? "OTP" : "Email"}
        </label>
        <div className={`${sharedStyles.inputFlex}`}>
          {verify ? (
            <InputEntry
              onChange={handleOtpChange}
              placeholder="6-digit code"
              name="otp"
              className={` ${sharedStyles.adjustInput}`}
              value={otp}
              inputMode="numeric"
            />
          ) : (
            <InputEntry
              toggle={editEmail}
              onChange={handleEmailChange}
              placeholder="new email"
              type="email"
              name="email"
              className={` ${sharedStyles.adjustInput}`}
              value={editEmail ? email : user.email}
            />
          )}

          <div className={`${sharedStyles.btnWrap}`}>
            {verify ? (
              <LoadingBtn
                onClick={handleOtpSubmit}
                className={sharedStyles.btn}
                label={"verify"}
              />
            ) : (
              <button
                onClick={handleEmailSubmit}
                className={` ${btnStyles.primaryBtn} ${sharedStyles.btn} ${
                  editEmail ? sharedStyles.btnShow : sharedStyles.btnHidden
                } ${btnStyles.defaultBtn} `}
              >
                change
              </button>
            )}
            <button
              onClick={cancelOtpVerify}
              className={`${sharedStyles.hideOnSmallView} ${
                editEmail ? sharedStyles.btnShow : sharedStyles.btnHidden
              }  ${sharedStyles.btn} ${btnStyles.defaultBtn} ${
                btnStyles.secondaryBtn
              }  `}
            >
              cancel
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                setEditEmail(true);
              }}
              className={` ${
                editEmail ? sharedStyles.btnHidden : sharedStyles.btnShow
              }  ${sharedStyles.hideOnSmallView} ${sharedStyles.btn} ${
                btnStyles.editBtn
              } ${btnStyles.defaultBtn}`}
            >
              edit
            </button>
          </div>
          <EditIcon
            handleClick={handleEditClick}
            className={`${sharedStyles.showOnSmallView} ${
              editEmail ? styles.iconOnEdit : ""
            } ${sharedStyles.editIcon}`}
            active={editEmail}
          />
        </div>
        <ErrorLog error={error} showError={showError} />
      </form>
    </>
  );
};

export default EmailForm;
