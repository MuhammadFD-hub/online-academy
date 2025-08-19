import styles from "./ProfilePic.module.css";
import EditInputIcon from "../EditInputIcon/EditInputIcon";
import UseProfileStore from "../UseProfileStore";
import getProfileUrl from "../getCloudUrl";

const ProfilePic = () => {
  const pfpCloudData = UseProfileStore((state) => state.pfpCloudData);
  const defaultPic =
    !pfpCloudData?.public_id || !pfpCloudData?.format ? true : false;

  return (
    <div className={`${styles.userPicInfoAlign}`}>
      <img
        src={
          defaultPic
            ? "/default-avatar.png"
            : getProfileUrl(
                pfpCloudData?.public_id,
                pfpCloudData?.format,
                "dzsxpy7qy"
              )
        }
        alt="Profile"
        className={`${styles.profilePic}`}
      />
      <h3 className={`${styles.username}`}>Username</h3>
      <EditInputIcon
        name={"profilePic"}
        className={styles.editIcon}
        isPfpChanging={true}
      />
    </div>
  );
};

export default ProfilePic;
