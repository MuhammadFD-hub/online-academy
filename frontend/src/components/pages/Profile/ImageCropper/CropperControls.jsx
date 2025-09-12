import styles from "./ImageCropper.module.css";
import btnStyles from "../Button.module.css";
import LoadingBtn from "../LoadingBtn/LoadingBtn";
import getCroppedImg from "./getCroppedImg";
import useCloudUpload from "../../../../hooks/useCloudUpload";
import UseStore from "../../../../stores/UseStore";

const CropperControls = () => {
  const croppedAreaPixels = UseStore((state) => state.croppedAreaPixels);
  const setCropperImage = UseStore((state) => state.setCropperImage);
  const postBgFocus = UseStore((state) => state.postBgFocus);
  const cropperImage = UseStore((state) => state.cropperImage);
  const isPfpChanging = UseStore((state) => state.isPfpChanging);
  const setCropBgFocus = UseStore((state) => state.setCropBgFocus);
  const cropBgFocus = UseStore((state) => state.cropBgFocus);
  let setCloudData = null,
    folder = null,
    link = null;
  if (isPfpChanging) {
    setCloudData = UseStore((state) => state.setPfpCloudData);
    folder = "profilePic";
    link = "http://localhost:5000/api/user/uploadPfp";
  } else {
    setCloudData = UseStore((state) => state.setBgCloudData);
    folder = "backgroundPic";
    link = "http://localhost:5000/api/user/uploadBg";
  }

  const token = localStorage.getItem("token");
  const { uploadImg } = useCloudUpload();

  function unlockScroll() {
    document.body.style.position = "";
    document.body.style.top = "";
    window.scrollTo(0, 0);
  }
  function cancelCropper() {
    setCropperImage(null);
    unlockScroll();
  }
  async function handleUpload() {
    try {
      postBgFocus();
      const croppedBlob = await getCroppedImg(cropperImage, croppedAreaPixels);
      const cloudData = await uploadImg(croppedBlob, folder);
      await fetch(link, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(cloudData),
      });
      setCloudData(cloudData);
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      unlockScroll();
      cancelCropper();
    }
  }
  return (
    <div
      className={`${cropperImage ? "" : styles.hideItem} ${
        styles.btnContainer
      } `}
    >
      <LoadingBtn
        onClick={handleUpload}
        className={`${styles.adjustBtn}`}
        label={"upload"}
      />
      <button
        onClick={cancelCropper}
        className={`${styles.adjustBtn} ${btnStyles.defaultBtn} ${btnStyles.secondaryBtn}`}
      >
        cancel
      </button>
      {!isPfpChanging && (
        <select
          className={`${styles.select}`}
          name="focus"
          id="focus"
          onChange={(e) => {
            const { name, value } = e.target;
            setCropBgFocus({ [name]: value });
          }}
          value={cropBgFocus.focus}
        >
          <option value="focusTop">focus top</option>
          <option value="focusMid">focus mid</option>
          <option value="focusBot">focus bot</option>
        </select>
      )}
    </div>
  );
};

export default CropperControls;
