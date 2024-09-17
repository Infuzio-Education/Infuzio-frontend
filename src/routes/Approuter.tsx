import { Route, Routes } from "react-router-dom";
import LoginPage from "../pages/Login";

const AppRouter = () => {
return (
    <Routes>
      <Route path="/" element={<LoginPage/>} />
    </Routes>
  );
}

export default AppRouter