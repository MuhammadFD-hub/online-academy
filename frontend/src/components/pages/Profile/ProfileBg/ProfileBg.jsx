import UseStore from "../../../../stores/UseStore";
import EditInputIcon from "../EditInputIcon/EditInputIcon";
import getProfileUrl from "../getCloudUrl";
import styles from "./ProfileBg.module.css";
const ProfileBg = () => {
  const bgCloudData = UseStore((state) => state.bgCloudData);
  const selectFocus = UseStore((state) => state.selectFocus);
  const setImgOverlayCloudData = UseStore(
    (state) => state.setImgOverlayCloudData
  );
  const defaultPic =
    !bgCloudData?.public_id || !bgCloudData?.format ? true : false;
  const focus = selectFocus.focus;
  let alignBg;
  if (focus === "focusTop") alignBg = styles.topBg;
  else if (focus === "focusBot") alignBg = styles.botBg;
  else alignBg = styles.centerBg;
  const bg = defaultPic
    ? "/default-bg.svg"
    : getProfileUrl(bgCloudData?.public_id, bgCloudData?.format);

  function lockScroll() {
    document.body.style.position = "fixed";
    document.body.style.top = `0px`;
    document.body.style.width = "100%";
  }
  function handleClick() {
    if (bgCloudData?.public_id) {
      lockScroll();
      setImgOverlayCloudData(bgCloudData);
    }
  }

  return (
    <>
      <div
        className={`${styles.profileBgContainer} ${alignBg}`}
        style={{
          cursor: bgCloudData?.public_id ? "pointer" : "initial",
          backgroundImage: `url(${bg})`,
        }}
        alt="background image"
        onClick={handleClick}
      >
        <EditInputIcon isPfpChanging={false} />
      </div>
    </>
  );
};

export default ProfileBg;
