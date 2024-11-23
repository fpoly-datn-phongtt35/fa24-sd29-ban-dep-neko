import { Link, useNavigate } from "react-router-dom";
import "../css/Sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Xóa token khỏi localStorage và điều hướng đến trang đăng nhập
    localStorage.removeItem("token");
    navigate("/login"); // Thay đổi đường dẫn đến trang đăng nhập
  };

  return (
    <div className="sidebar">
      <h3>Quản lý</h3>
      <ul>
        <li>
          <Link to="/manageStaff">Quản lý Nhân viên</Link>
        </li>
        <li>
          <Link to="/manageProduct">Quản lý Sản phẩm</Link>
        </li>
        <li>
          <Link to="/manageVoucher">Quản lý Voucher</Link>
        </li>
        <li>
          <Link to="/manageCategory">Quản lý loại sản phẩm</Link>
        </li>
        {/* <li>
          <Link to="/manageTransportation">Quản lý vận chuyển</Link>
        </li> */}
      </ul>
      <button onClick={handleLogout} className="logout-button">
        Đăng xuất
      </button>
    </div>
  );
};

export default Sidebar;
