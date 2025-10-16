import { Container } from "react-bootstrap";
import { motion } from "framer-motion";
import styles from "./Profile.module.css";
import PersonalForm from "./PersonalForm/PersonalForm.jsx";
import AccountInfo from "./AccountInfo/AccountInfo.jsx";
import ProfileBg from "./ProfileBg/ProfileBg.jsx";
import ProfilePic from "./ProfilePic/ProfilePic.jsx";
import ImageCropper from "./ImageCropper/ImageCropper.jsx";
import { useEffect } from "react";
import CropperControls from "./ImageCropper/CropperControls.jsx";
import ImageOverlay from "./ImageOverlay/ImageOverlay.jsx";
import UseStore from "../../../stores/UseStore.jsx";

const Profile = () => {
  const setPfpCloudData = UseStore((s) => s.setPfpCloudData);
  const setBgCloudData = UseStore((s) => s.setBgCloudData);
  const setPersonalForm = UseStore((s) => s.setPersonalForm);
  const getBgFocus = UseStore((s) => s.getBgFocus);
  const getUsername = UseStore((s) => s.getUsername);
  const fetchWithAuth = UseStore((s) => s.fetchWithAuth);

  useEffect(() => {
    async function fetchCloudDataPfp() {
      const res = await fetchWithAuth("http://localhost:5000/api/user/getPfp");
      const data = await res.json();
      if (data.pfpCloudData) setPfpCloudData(data.pfpCloudData);
    }
    async function fetchCloudDataBg() {
      const res = await fetchWithAuth("http://localhost:5000/api/user/getBg");
      const data = await res.json();
      setBgCloudData(data.bgCloudData);
    }
    async function fetchPersonalData() {
      const res = await fetchWithAuth(
        "http://localhost:5000/api/user/getUserInfo"
      );
      const data = await res.json();
      setPersonalForm(data.personalForm);
    }
    fetchCloudDataBg();
    fetchCloudDataPfp();
    fetchPersonalData();
    getBgFocus();
    getUsername();
  }, []);

  return (
    <>
      <ImageOverlay />
      <ImageCropper />
      <CropperControls />
      <Container className={`mt-4 `}>
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className={`${styles.profile}`}
        >
          <ProfileBg />
          <ProfilePic />
          <div className={`${styles.userInfoContainer}`}>
            <PersonalForm />
            <AccountInfo />
          </div>
        </motion.div>
      </Container>
    </>
  );
};
export default Profile;
