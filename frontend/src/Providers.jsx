import CacheProvider from "./context/Providers/CacheProvider";

const Providers = ({ children }) => {
  return <CacheProvider>{children}</CacheProvider>;
};

export default Providers;
