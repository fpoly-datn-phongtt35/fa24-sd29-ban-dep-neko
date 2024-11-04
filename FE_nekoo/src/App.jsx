import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Auth/Login";
import ViewAll from "./components/Product/ViewAll";
import ManageCustomer from "./components/Staff/ManageCustomer";
import ManageStaff from "./components/Manager/ManageStaff";
import Home from "./components/Home";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/manageProduct" element={<ViewAll />} />
        <Route path="/manageCustomer" element={<ManageCustomer />} />
        <Route path="/manageStaff" element={<ManageStaff />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default App;
