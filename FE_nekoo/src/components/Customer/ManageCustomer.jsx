import { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import { HiShoppingCart } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import "../../css/shop/fontStyle.css";
import "../../css/bootstrap/bootstrap.min.css";
import "../../css/bootstrap/magnific-popup.css";
import "../../css/bootstrap/jquery-ui.css";
import "../../css/bootstrap/owl.carousel.min.css";
import "../../css/bootstrap/owl.theme.default.min.css";
import "../../css/bootstrap/aos.css";
import "../../css/shop/style.css";
import { fetchOneCustomer } from "../../services/customerService";
import UpdateCustomerModal from "./UpdateCustomerModal";
import { ToastContainer, toast } from "react-toastify"; // Import Toastify
import "react-toastify/dist/ReactToastify.css"; // Import CSS Toastify

const ManageCustomer = () => {
  const [customer, setCustomer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      const id = localStorage.getItem("userId");
      fetchOneCustomer(id, token)
        .then((data) => setCustomer(data))
        .catch((error) => console.error("Error fetching customer:", error));
    }
  }, [token]);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  // Refresh customer data after updating and show toast
  const handleUpdate = () => {
    const id = localStorage.getItem("userId");
    fetchOneCustomer(id, token).then((data) => {
      setCustomer(data); // Cập nhật lại thông tin khách hàng
      toast.success("Cập nhật thông tin khách hàng thành công!"); // Hiển thị toast thông báo thành công
    });
  };
  const handleLogout = () => {
    // Xóa token khỏi localStorage và điều hướng đến trang đăng nhập
    localStorage.clear();
    navigate("/login"); // Thay đổi đường dẫn đến trang đăng nhập
  };

  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css?family=Mukta:300,400,700"
      />
      <div className="site-wrap">
        <header className="site-navbar" role="banner">
          <div className="site-navbar-top">
            <div className="container">
              <div className="row align-items-center">
                <div className="col-6 col-md-4 order-2 order-md-1 site-search-icon text-left"></div>
                <div className="col-12 mb-3 mb-md-0 col-md-4 order-1 order-md-2 text-center">
                  <div className="site-logo">
                    <a className="js-logo-clone">Nekoo Shop</a>
                  </div>
                </div>
                <div className="col-6 col-md-4 order-3 order-md-3 text-right">
                  <div className="site-top-icons">
                    <ul>
                      <li>
                        <Link to={"/customer"}>
                          <FaUser />
                        </Link>
                      </li>
                      <li>
                        <Link to={"/cart"} className="site-cart">
                          <HiShoppingCart />
                        </Link>
                      </li>
                      <li>
                        {token ? (
                          <Link
                            to={"/login"}
                            className="site-cart"
                            onClick={handleLogout}
                          >
                            <span>Đăng xuất</span>
                          </Link>
                        ) : (
                          <Link to={"/login"} className="site-cart">
                            <span>Đăng nhập</span>
                          </Link>
                        )}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>
        <div className="container mt-4">
          <h2 className="text-center">Thông tin khách hàng</h2>
          {customer ? (
            <div className="row customer-info">
              {/* Left Column */}
              <div className="col-md-6">
                <div className="mb-3 row">
                  <label className="col-sm-4 col-form-label text-center">
                    Họ và tên:
                  </label>
                  <div className="col-sm-8">
                    <output className="form-control-plaintext text-center">
                      {customer.name}
                    </output>
                  </div>
                </div>
                <div className="mb-3 row">
                  <label className="col-sm-4 col-form-label text-center">
                    Ngày sinh:
                  </label>
                  <div className="col-sm-8">
                    <output className="form-control-plaintext text-center">
                      {new Date(customer.dateOfBirth).toLocaleDateString()}
                    </output>
                  </div>
                </div>
                <div className="mb-3 row">
                  <label className="col-sm-4 col-form-label text-center">
                    Số điện thoại:
                  </label>
                  <div className="col-sm-8">
                    <output className="form-control-plaintext text-center">
                      {customer.phone}
                    </output>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="col-md-6">
                <div className="mb-3 row">
                  <label className="col-sm-4 col-form-label text-center">
                    CCCD:
                  </label>
                  <div className="col-sm-8">
                    <output className="form-control-plaintext text-center">
                      {customer.cccd}
                    </output>
                  </div>
                </div>
                <div className="mb-3 row">
                  <label className="col-sm-4 col-form-label text-center">
                    Địa chỉ:
                  </label>
                  <div className="col-sm-8">
                    <output className="form-control-plaintext text-center">
                      {customer.address}
                    </output>
                  </div>
                </div>
                <div className="mb-3 row">
                  <label className="col-sm-4 col-form-label text-center">
                    Giới tính:
                  </label>
                  <div className="col-sm-8">
                    <output className="form-control-plaintext text-center">
                      {customer.gender ? "Nam" : "Nữ"}
                    </output>
                  </div>
                </div>
              </div>
              {/* Update Button */}
              <div className="col-md-12 text-center mt-4">
                <button
                  className="btn btn-primary mt-3"
                  onClick={handleOpenModal}
                >
                  Cập nhật thông tin
                </button>
                {isModalOpen && (
                  <div className="modal-overlay">
                    <div className="modal-content">
                      <UpdateCustomerModal
                        customer={customer}
                        onClose={handleCloseModal}
                        onUpdate={handleUpdate}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <p className="text-center">Không tìm thấy thông tin khách hàng.</p>
          )}
        </div>
      </div>
      <ToastContainer /> {/* Thêm ToastContainer vào cuối component */}
    </>
  );
};

export default ManageCustomer;
