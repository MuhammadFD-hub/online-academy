import styles from "./ProfilePic.module.css";
import EditInputIcon from "../EditInputIcon/EditInputIcon";
import getProfileUrl from "../getCloudUrl";
import UseStore from "../../../../stores/UseStore";

const ProfilePic = () => {
  const pfpCloudData = UseStore((state) => state.pfpCloudData);
  const setImgOverlayCloudData = UseStore(
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
    if (pfpCloudData.public_id) {
      lockScroll();
      setImgOverlayCloudData(pfpCloudData);
    }
  }
  return (
    <div className={`${styles.userPicInfoAlign}`}>
      <img
        onClick={handleClick}
        src={
          defaultPic
            ? "/default-pfp.svg"
            : getProfileUrl(pfpCloudData?.public_id, pfpCloudData?.format)
        }
        alt="Profile"
        style={{
          cursor: pfpCloudData?.public_id ? "pointer" : "initial",
        }}
        className={`${styles.profilePic}`}
      />
      <h3 className={`${styles.username}`}>Username</h3>
      <EditInputIcon isPfpChanging={true} />
    </div>
  );
};

export default ProfilePic;
