import { Container } from "react-bootstrap";
import styles from "./Profile.module.css";
import PersonalForm from "./PersonalForm/PersonalForm.jsx";
import AccountInfo from "./AccountInfo/AccountInfo.jsx";
import ProfileBg from "./ProfileBg/ProfileBg.jsx";
import ProfilePic from "./ProfilePic/ProfilePic.jsx";
import ImageCropper from "./ImageCropper/ImageCropper.jsx";
import { useEffect } from "react";
import UseProfileStore from "./UseProfileStore.jsx";
import CropperControls from "./ImageCropper/CropperControls.jsx";
import ImageOverlay from "./ImageOverlay/ImageOverlay.jsx";

const Profile = () => {
  const token = localStorage.getItem("token");
  const setPfpCloudData = UseProfileStore((state) => state.setPfpCloudData);
  const setBgCloudData = UseProfileStore((state) => state.setBgCloudData);
  const setPersonalForm = UseProfileStore((state) => state.setPersonalForm);
  const getBgFocus = UseProfileStore((state) => state.getBgFocus);

  useEffect(() => {
    async function fetchCloudDataPfp() {
      const res = await fetch("http://localhost:5000/api/user/getPfp", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setPfpCloudData(data.pfpCloudData);
    }
    async function fetchCloudDataBg() {
      const res = await fetch("http://localhost:5000/api/user/getBg", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setBgCloudData(data.bgCloudData);
    }
    async function fetchPersonalData() {
      const res = await fetch("http://localhost:5000/api/user/getUserInfo", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setPersonalForm(data.personalForm);
    }
    fetchCloudDataBg();
    fetchCloudDataPfp();
    fetchPersonalData();
    getBgFocus(token);
  }, []);

  return (
    <>
      <ImageOverlay />
      <ImageCropper />
      <CropperControls />
      <Container className={`mt-4 `}>
        <div className={`${styles.profile}`}>
          <ProfileBg />
          <ProfilePic />
          <div className={`${styles.userInfoContainer}`}>
            <PersonalForm />
            <AccountInfo />
          </div>
        </div>
      </Container>
    </>
  );
};
export default Profile;
