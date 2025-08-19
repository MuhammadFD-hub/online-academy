import { useCallback, useState } from "react";
import styles from "./ImageCropper.module.css";
import Cropper from "react-easy-crop";
import UseProfileStore from "../UseProfileStore";
import btnStyles from "../Button.module.css";
import LoadingBtn from "../LoadingBtn/LoadingBtn";
import getCroppedImg from "./getCroppedImg";
import useCloudUpload from "../../../../hooks/useCloudUpload";
//to make it completely reusable, use global states for all isPfpChanging
const ImageCropper = () => {
  const cropperImage = UseProfileStore((state) => state.cropperImage);
  const setCropperImage = UseProfileStore((state) => state.setCropperImage);
  const isPfpChanging = UseProfileStore((state) => state.isPfpChanging);
  let setCloudData = null,
    folder = null,
    link = null,
    ratio = null;
  if (isPfpChanging) {
    setCloudData = UseProfileStore((state) => state.setPfpCloudData);
    folder = "profilePic";
    link = "http://localhost:5000/api/user/uploadPfp";
    ratio = 1;
  } else {
    setCloudData = UseProfileStore((state) => state.setBgCloudData);
    folder = "backgroundPic";
    link = "http://localhost:5000/api/user/uploadBg";
    ratio = 16 / 9;
  }

  const token = localStorage.getItem("token");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const { uploadImg } = useCloudUpload();

  const containerStyles = `${cropperImage ? "" : styles.hideItem} ${
    styles.containerStyles
  }`;

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
  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  return (
    <>
      <Cropper
        classes={{
          containerClassName: containerStyles,
          cropAreaClassName: styles.cropArea,
          mediaClassName: styles.cropImage,
        }}
        image={cropperImage}
        alt="Profile"
        crop={crop}
        onCropChange={setCrop}
        zoom={zoom}
        onZoomChange={setZoom}
        aspect={ratio} //16 / 9
        onCropComplete={onCropComplete}
      />
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
      </div>
    </>
  );
};

export default ImageCropper;
