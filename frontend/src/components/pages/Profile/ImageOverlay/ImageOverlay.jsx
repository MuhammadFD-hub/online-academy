import EditIcon from "../EditIcon/EditIcon";
import getCloudUrl from "../getCloudUrl";
import UseProfileStore from "../UseProfileStore";
import styles from "./ImageOverlay.module.css";
import { useRef, useState } from "react";

const ImageOverlay = () => {
  const imgOverlayCloudData = UseProfileStore(
    (state) => state.imgOverlayCloudData
  );
  const setImgOverlayCloudData = UseProfileStore(
    (state) => state.setImgOverlayCloudData
  );
  const [scale, setScale] = useState(1);
  const initialScale = useRef(1);

  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const pinchStart = useRef(null);

  function closeOverlay() {
    unlockScroll();
    setImgOverlayCloudData(null);
    setScale(1);
    setOffset({ x: 0, y: 0 });
  }
  function unlockScroll() {
    document.body.style.position = "";
    document.body.style.top = "";
    window.scrollTo(0, 0);
  }
  function getDistance(touches) {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  return (
    <div
      className={`${imgOverlayCloudData || styles.hideOverlay} ${
        styles.imgContainer
      }`}
      onClick={closeOverlay}
    >
      <EditIcon
        handleClick={closeOverlay}
        active={true}
        className={styles.closeIcon}
      />
      <img
        draggable={false}
        className={`${styles.image}`}
        src={getCloudUrl(
          imgOverlayCloudData?.public_id,
          imgOverlayCloudData?.format
        )}
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
          transition: isDragging ? "none" : "transform 0.2s ease-out",
          cursor: isDragging ? "grabbing" : "grab",
        }}
        onClick={(e) => e.stopPropagation()}
        onWheel={(e) => {
          e.preventDefault();
          const zoomIntensity = 0.1;
          if (e.deltaY < 0)
            setScale((s) => Math.min(s + zoomIntensity, 5)); // zoom in
          else setScale((s) => Math.max(s - zoomIntensity, 1)); // zoom out
        }}
        onMouseDown={(e) => {
          setIsDragging(true);
          dragStart.current = {
            x: e.clientX - offset.x,
            y: e.clientY - offset.y,
          };
        }}
        onMouseMove={(e) => {
          if (!isDragging) return;
          setOffset({
            x: e.clientX - dragStart.current.x,
            y: e.clientY - dragStart.current.y,
          });
        }}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onTouchStart={(e) => {
          if (e.touches.length === 1) {
            setIsDragging(true);
            dragStart.current = {
              x: e.touches[0].clientX - offset.x,
              y: e.touches[0].clientY - offset.y,
            };
          } else if (e.touches.length === 2) {
            pinchStart.current = getDistance(e.touches);
            initialScale.current = scale; // save current scale
          }
        }}
        onTouchMove={(e) => {
          if (e.touches.length === 1 && isDragging) {
            setOffset({
              x: e.touches[0].clientX - dragStart.current.x,
              y: e.touches[0].clientY - dragStart.current.y,
            });
          } else if (e.touches.length === 2 && pinchStart.current) {
            const newDistance = getDistance(e.touches);
            const scaleFactor = newDistance / pinchStart.current;
            setScale(
              Math.max(1, Math.min(initialScale.current * scaleFactor, 5))
            );
          }
        }}
        onTouchEnd={(e) => {
          if (e.touches.length < 2) {
            pinchStart.current = null;
          }
          if (e.touches.length === 0) {
            setIsDragging(false);
          }
        }}
      />
    </div>
  );
};

export default ImageOverlay;
