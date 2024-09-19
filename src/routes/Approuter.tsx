
import { Route, Routes } from "react-router-dom";
import LoginPage from "../pages/Login";
import Schools from "../pages/superAdmin/Schools";
import Navbar from '../components/layouts/navbar';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route element={<Navbar />}>
        <Route path="/superAdmin" element={<Schools />} />
        {/* Add more superAdmin routes here as needed */}
      </Route>
    </Routes>
  );
}

export default AppRouter;