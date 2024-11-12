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
      <h3>Nhân viên</h3>
      <ul>
        <li>
          <Link to="/manageCustomer">Quản lý Khách hàng</Link>
        </li>
        <li>
          <Link to="/manageBill">Quản lý Hoá đơn</Link>
        </li>
      </ul>
      <button onClick={handleLogout} className="logout-button">
        Đăng xuất
      </button>
    </div>
  );
};

export default Sidebar;
