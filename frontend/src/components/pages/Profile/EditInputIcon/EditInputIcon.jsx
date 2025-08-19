import { useRef } from "react";
import EditIcon from "../EditIcon/EditIcon";
import UseProfileStore from "../UseProfileStore";

const EditInputIcon = ({ name, className, isPfpChanging }) => {
  const inputRef = useRef(null);

  const setCropperImage = UseProfileStore((state) => state.setCropperImage);
  const setIsPfpChanging = UseProfileStore((state) => state.setIsPfpChanging);
  function lockScroll() {
    document.body.style.position = "fixed";
    document.body.style.top = `0px`;
    document.body.style.width = "100%";
  }

  function handleEditClick() {
    inputRef.current.click();
    setIsPfpChanging(isPfpChanging);
  }
  function handleInputChange(e) {
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
        onChange={handleInputChange}
      />

      <EditIcon className={className} handleClick={handleEditClick} />
    </>
  );
};

export default EditInputIcon;
