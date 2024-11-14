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

import ManageCategory from "./components/Manager/ManageCategory";

import ManageTransportation from "./components/Manager/ManageTransportation";

import ManageCustomer from "./components/Staff/ManageCustomer";

import Customer from "./components/Customer/ManageCustomer";

import ManageStaff from "./components/Manager/ManageStaff";

import ManageOrder from "./components/Manager/ManageOrder";

import Unauthorized from "./components/Auth/unauthorized/index";

import Shop from "./components/pages/shop";
import Detail from "./components/pages/Detail";
import Cart from "./components/pages/Cart";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Authen */}
        <Route path="/" element={<Navigate to="/shop" />} />
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
        {/* Category */}
        <Route path="/manageCategory" element={<ManageCategory />} />
        {/* Transportation */}
        <Route
          path="/manageTransportation"
          element={<ManageTransportation />}
        />
        {/* Order */}
        <Route path="/manageOrder" element={<ManageOrder />} />
        {/* shop-screen */}
        <Route path="/shop" element={<Shop />} />
        {/* shop-screen */}
        <Route path="/detail/:productId" element={<Detail />} />
        <Route path="/cart" element={<Cart />} />
        {/* customer-screen */}
        <Route path="/customer" element={<Customer />} />
        {/* Không xác định */}
        <Route path="/unauthorized" element={<Unauthorized />}></Route>
      </Routes>
    </Router>
  );
};

export default App;
