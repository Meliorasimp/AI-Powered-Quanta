import "./styles/index.css";
import { useRoutes } from "react-router-dom";
import routes from "./routes";
import { Bounce, ToastContainer } from "react-toastify";

function App() {
  const route = useRoutes(routes);
  console.log("VITE_API_URL:", import.meta.env.VITE_API_URL);
  return (
    <>
      {route}
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Bounce}
      />
    </>
  );
}

export default App;
