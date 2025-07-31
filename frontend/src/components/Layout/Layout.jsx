import { Outlet } from "react-router-dom";

import Sidebar from "../Sidebar/Sidebar";
import Header from "../Header/Header";

import styles from "./Layout.module.css";

export default function Layout({ user }) {
  return (
    <>
      <header>
        <Header />
      </header>

      <div className={`${styles.dummyHeader}`}></div>

      {user && (
        <aside>
          <Sidebar />
        </aside>
      )}

      <main className={`${user ? styles.adjustSidebar : ""}`}>
        <Outlet />
      </main>
    </>
  );
}
