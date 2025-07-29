import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import useAuth from "../hooks/useAuth";
import Header from "./Header";

export default function Layout({ user }) {
  return (
    <>
      <header>
        <Header />
      </header>

      {user && (
        <aside>
          <Sidebar />
        </aside>
      )}

      <main
        style={{
          marginLeft: user ? 60 : 0,
        }}
      >
        <Outlet />
      </main>
    </>
  );
}
