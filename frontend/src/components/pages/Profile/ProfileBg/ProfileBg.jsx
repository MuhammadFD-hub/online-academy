import EditInputIcon from "../EditInputIcon/EditInputIcon";
import getProfileUrl from "../getCloudUrl";
import UseProfileStore from "../UseProfileStore";
import styles from "./ProfileBg.module.css";
const ProfileBg = () => {
  const bgCloudData = UseProfileStore((state) => state.bgCloudData);
  const defaultPic =
    !bgCloudData?.public_id || !bgCloudData?.format ? true : false;

  return (
    <>
      <div
        className={`${styles.profileBgContainer}`}
        style={{
          background: `url("${
            defaultPic
              ? "/default-bg.jpg"
              : getProfileUrl(
                  bgCloudData?.public_id,
                  bgCloudData?.format,
                  "dzsxpy7qy"
                )
          }") no-repeat center center`,
        }}
      >
        <EditInputIcon
          name={"profileBg"}
          className={styles.editIcon}
          isPfpChanging={false}
        />
      </div>
      ;
    </>
  );
};

export default ProfileBg;
