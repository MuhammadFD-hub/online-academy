import { useCallback, useState } from "react";
import styles from "./ImageCropper.module.css";
import Cropper from "react-easy-crop";
import UseProfileStore from "../UseProfileStore";
//to make it completely reusable, use global states for all isPfpChanging
const ImageCropper = () => {
  const cropperImage = UseProfileStore((state) => state.cropperImage);
  const cropBgFocus = UseProfileStore((state) => state.cropBgFocus);
  const isPfpChanging = UseProfileStore((state) => state.isPfpChanging);
  const setCroppedAreaPixels = UseProfileStore(
    (state) => state.setCroppedAreaPixels
  );
  const ratio = isPfpChanging ? 1 : 2.1 / 1;

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const containerStyles = `${cropperImage ? "" : styles.hideItem} ${
    styles.containerStyles
  }`;

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);
  const focus = cropBgFocus.focus;

  return (
    <Cropper
      classes={{
        containerClassName: containerStyles,
        cropAreaClassName: `${
          isPfpChanging ||
          `${focus === "focusTop" && styles.focusTop} ${
            focus === "focusBot" && styles.focusBot
          } ${styles.cropAreaBg}`
        } ${styles.cropArea}`,
        mediaClassName: styles.cropImage,
      }}
      image={cropperImage}
      alt="Profile"
      crop={crop}
      onCropChange={setCrop}
      zoom={zoom}
      onZoomChange={setZoom}
      aspect={ratio}
      onCropComplete={onCropComplete}
    />
  );
};

export default ImageCropper;
