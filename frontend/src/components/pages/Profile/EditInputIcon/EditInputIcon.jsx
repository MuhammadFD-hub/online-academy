import { useEffect, useRef } from "react";
import EditIcon from "../EditIcon/EditIcon";
import UseProfileStore from "../UseProfileStore";
import { useState } from "react";
import styles from "./EditInputIcon.module.css";
import btnStyles from "../Button.module.css";
import BgOpts from "./BgOpts/BgOpts";

const EditInputIcon = ({ isPfpChanging }) => {
  const menuRef = useRef(null);
  const inputRef = useRef(null);
  const [hideMenu, setHideMenu] = useState(true);
  const bgCloudData = UseProfileStore((state) => state.bgCloudData);
  const setCropperImage = UseProfileStore((state) => state.setCropperImage);
  const setIsPfpChanging = UseProfileStore((state) => state.setIsPfpChanging);
  const name = isPfpChanging ? "profilePic" : "profileBg";
  const editIconStyles = isPfpChanging ? styles.editIconPfp : styles.editIconBg;
  const menuStyles = isPfpChanging ? styles.PfpMenu : styles.bgMenu;

  useEffect(() => {
    if (hideMenu) return;

    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target))
        setHideMenu(true);
    }

    document.addEventListener("pointerdown", handleClickOutside);
    return () => {
      document.removeEventListener("pointerdown", handleClickOutside);
    };
  }, [hideMenu]);

  function lockScroll() {
    document.body.style.position = "fixed";
    document.body.style.top = `0px`;
    document.body.style.width = "100%";
  }
  function handleEditIconClick() {
    setHideMenu(!hideMenu);
  }
  function handleNewImg() {
    inputRef.current.click();
    setHideMenu(true);
    setIsPfpChanging(isPfpChanging);
  }
  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) {
      alert("no image was found");
      return;
    } else if (["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      lockScroll();
      setCropperImage(URL.createObjectURL(file));
    } else alert("file type not allowed");
  }
  return (
    <>
      <input
        ref={inputRef}
        accept={"image/jpeg, image/png, image/webp"}
        type="file"
        name={name}
        id={name}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <div ref={menuRef} onClick={(e) => e.stopPropagation()}>
        <EditIcon
          className={`${styles.editIcon} ${editIconStyles}`}
          active={!hideMenu}
          handleClick={handleEditIconClick}
        />
        <div
          className={`${hideMenu && styles.menuHide} ${
            styles.menu
          } ${menuStyles}`}
        >
          <button
            onClick={handleNewImg}
            className={`${btnStyles.defaultBtn} ${styles.newImageBtn}`}
          >
            new image
          </button>
          <button className={`${btnStyles.defaultBtn} ${styles.deleteBtn}`}>
            delete
          </button>
          {!isPfpChanging && bgCloudData?.public_id && <BgOpts />}
        </div>
      </div>
    </>
  );
};

export default EditInputIcon;
