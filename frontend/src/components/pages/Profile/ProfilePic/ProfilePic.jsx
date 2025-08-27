import styles from "./ProfilePic.module.css";
import EditInputIcon from "../EditInputIcon/EditInputIcon";
import UseProfileStore from "../UseProfileStore";
import getProfileUrl from "../getCloudUrl";

const ProfilePic = () => {
  const pfpCloudData = UseProfileStore((state) => state.pfpCloudData);
  const setImgOverlayCloudData = UseProfileStore(
    (state) => state.setImgOverlayCloudData
  );
  const defaultPic =
    !pfpCloudData?.public_id || !pfpCloudData?.format ? true : false;
  function lockScroll() {
    document.body.style.position = "fixed";
    document.body.style.top = `0px`;
    document.body.style.width = "100%";
  }
  function handleClick() {
    lockScroll();
    setImgOverlayCloudData(pfpCloudData);
  }
  return (
    <div className={`${styles.userPicInfoAlign}`}>
      <img
        onClick={handleClick}
        src={
          defaultPic
            ? "/default-avatar.png"
            : getProfileUrl(pfpCloudData?.public_id, pfpCloudData?.format)
        }
        alt="Profile"
        className={`${styles.profilePic}`}
      />
      <h3 className={`${styles.username}`}>Username</h3>
      <EditInputIcon isPfpChanging={true} />
    </div>
  );
};

export default ProfilePic;
