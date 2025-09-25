import { useRef, useState } from "react";
import styles from "./BgOpts.module.css";
import LoadingIcon from "./LoadingIcon/LoadingIcon";
import UseStore from "../../../../../stores/UseStore";

const BgOpts = () => {
  const setSelectFocus = UseStore((state) => state.setSelectFocus);
  const selectFocus = UseStore((state) => state.selectFocus);
  const postBgFocus = UseStore((state) => state.postBgFocus);
  const [showBtn, setShowBtn] = useState(false);
  const radioOpt = useRef({ focus: null });
  if (selectFocus.focus !== null && radioOpt?.current.focus === null)
    radioOpt.current = selectFocus;

  async function handleSubmit() {
    await postBgFocus(selectFocus);
    setShowBtn(false);

    radioOpt.current = selectFocus;
  }
  function handleRadioChange(e) {
    const value = e.target.value;
    setSelectFocus({ focus: value });
    if (radioOpt.current.focus !== value) setShowBtn(true);
    else setShowBtn(false);
  }
  return (
    <>
      <div className={`${styles.line}`} />
      <label
        className={`${styles.radioLabel} ${
          selectFocus.focus === "focusTop" && styles.activeLabel
        }`}
      >
        focus top
        <input
          style={{ display: "none" }}
          checked={selectFocus.focus === "focusTop"}
          onChange={handleRadioChange}
          type="radio"
          value="focusTop"
          name="bgFocusPos"
          id="focusTop"
        />
      </label>
      <label
        className={`${styles.radioLabel} ${
          selectFocus.focus === "focusMid" && styles.activeLabel
        }`}
      >
        focus mid
        <input
          style={{ display: "none" }}
          checked={selectFocus.focus === "focusMid"}
          onChange={handleRadioChange}
          type="radio"
          value="focusMid"
          name="bgFocusPos"
          id="focusMid"
        />
      </label>
      <label
        className={`${selectFocus.focus === "focusBot" && styles.activeLabel} ${
          styles.radioLabel
        }`}
      >
        focus bot
        <input
          style={{ display: "none" }}
          checked={selectFocus.focus === "focusBot"}
          onChange={handleRadioChange}
          type="radio"
          value="focusBot"
          name="bgFocusPos"
          id="focusBot"
        />
      </label>

      <LoadingIcon
        onClick={handleSubmit}
        className={`${showBtn ? "" : styles.hideIcon} ${styles.loadingIcon}`}
      />
    </>
  );
};

export default BgOpts;
