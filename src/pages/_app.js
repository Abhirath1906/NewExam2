import "../pages/styles/global.css"
import "antd/dist/reset.css";
import { AppProvider, useAppContext } from "./context/AppContext";

function ThemeWrapper({ Component, pageProps }) {
  const { theme } = useAppContext();

  return (
    <div className={theme === "dark" ? "theme-dark" : "theme-light"}>
      <Component {...pageProps} />
    </div>
  );
}

export default function App({ Component, pageProps }) {
  return (
    <AppProvider>
      <ThemeWrapper Component={Component} pageProps={pageProps} />
    </AppProvider>
  );
}
