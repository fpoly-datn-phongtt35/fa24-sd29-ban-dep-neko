import { useEffect, useState } from "react";
//css
import "../../css/shop/fontStyle.css";
import "../../css/bootstrap/bootstrap.min.css";
import "../../css/bootstrap/magnific-popup.css";
import "../../css/bootstrap/jquery-ui.css";
import "../../css/bootstrap/owl.carousel.min.css";
import "../../css/bootstrap/owl.theme.default.min.css";
import "../../css/bootstrap/aos.css";
import "../../css/shop/style.css";
// import "../../css/ManageOrder.css";
import { Link, useNavigate } from "react-router-dom";

//icon
import { FaUser } from "react-icons/fa";
import { HiShoppingCart } from "react-icons/hi";

import ManagerOrder from "../Manager/ManageOrder";
import useAuthorization from "../../hooks/useAuthorization";

const Order = () => {
  useAuthorization(["CUSTOMER"]);
  const navigate = useNavigate();
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
                        {localStorage.getItem("token") ? (
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
          <nav
            className="site-navigation text-right text-md-center"
            role="navigation"
          >
            <div className="container">
              <ul className="site-menu js-clone-nav d-none d-md-block">
                <li>
                  <Link to="/shop">CỬA HÀNG</Link>
                </li>
                <li>
                  <Link to="/cart">GIỎ HÀNG</Link>
                </li>
                <li className="active">
                  <Link to="/order">ĐƠN HÀNG</Link>
                </li>
              </ul>
            </div>
          </nav>
        </header>
        <div
          className="order-conten"
          style={{ maxWidth: "1200px", margin: "auto" }}
        >
          <ManagerOrder />
        </div>
        <footer className="site-footer border-top">
          <div className="container">
            <div className="row">
              <div className="col-lg-6 mb-5 mb-lg-0">
                <a href="https://caodang.fpt.edu.vn" className="block-6">
                  <h3 className="font-weight-light  mb-0">FPT Polytechnic</h3>
                  <p>Education</p>
                </a>
              </div>
              <div className="col-md-6 col-lg-3 mb-4 mb-lg-0"></div>
              <div className="col-md-6 col-lg-3">
                <div className="block-5 mb-5">
                  <h3 className="footer-heading mb-4">Contact Info</h3>
                  <ul className="list-unstyled">
                    <li style={{ paddingLeft: "0" }}>
                      <FaUser />
                      TuanDV - PH57067
                    </li>
                    <li style={{ paddingLeft: "0" }}>
                      <FaUser />
                      HaTT - PH43394
                    </li>
                    <li style={{ paddingLeft: "0" }}>
                      <FaUser />
                      TanTH - PH43325
                    </li>
                    <li style={{ paddingLeft: "0" }}>
                      <FaUser />
                      LongNH - PH43354
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};
export default Order;
