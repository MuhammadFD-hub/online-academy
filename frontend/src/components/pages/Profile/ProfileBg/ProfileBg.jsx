import EditInputIcon from "../EditInputIcon/EditInputIcon";
import getProfileUrl from "../getCloudUrl";
import UseProfileStore from "../UseProfileStore";
import styles from "./ProfileBg.module.css";
const ProfileBg = () => {
  const bgCloudData = UseProfileStore((state) => state.bgCloudData);
  const selectFocus = UseProfileStore((state) => state.selectFocus);
  const defaultPic =
    !bgCloudData?.public_id || !bgCloudData?.format ? true : false;
  const focus = selectFocus.focus;
  let alignBg;
  if (focus === "focusTop") alignBg = styles.topBg;
  else if (focus === "focusBot") alignBg = styles.botBg;
  else alignBg = styles.centerBg;
  const bg = defaultPic
    ? "/default-bg.jpg"
    : getProfileUrl(bgCloudData?.public_id, bgCloudData?.format, "dzsxpy7qy");
  return (
    <>
      <div
        className={`${styles.profileBgContainer} ${alignBg}`}
        style={{ backgroundImage: `url(${bg})` }}
        alt="background image"
      >
        <EditInputIcon isPfpChanging={false} />
      </div>
    </>
  );
};

export default ProfileBg;
