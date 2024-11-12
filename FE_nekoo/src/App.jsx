import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";

import ManageProduct from "./components/Manager/ManageProduct";
import ManageProductDetail from "./components/Manager/ManageProductDetail";

import ManageVoucher from "./components/Manager/ManageVoucher";

import ManageCustomer from "./components/Staff/ManageCustomer";
import ManageStaff from "./components/Manager/ManageStaff";

import Unauthorized from "./components/Auth/unauthorized/index";

import Shop from "./components/pages/shop";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Authen */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registor" element={<Register />} />
        {/* User */}
        <Route path="/manageCustomer" element={<ManageCustomer />} />
        <Route path="/manageStaff" element={<ManageStaff />} />
        {/* Sản phẩm */}
        <Route path="/manageProduct" element={<ManageProduct />} />
        <Route
          path="/manageProductDetail/:productId"
          element={<ManageProductDetail />}
        />
        {/* Voucher */}
        <Route path="/manageVoucher" element={<ManageVoucher />} />
        {/* shop-screen */}
        <Route path="/shop" element={<Shop />} />
        {/* Không xác định */}
        <Route path="/unauthorized" element={<Unauthorized />}></Route>
      </Routes>
    </Router>
  );
};

export default App;
