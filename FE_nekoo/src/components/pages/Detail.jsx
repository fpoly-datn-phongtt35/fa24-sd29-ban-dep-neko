import { useEffect, useState } from "react";
import { fetchProductDetails } from "../../services/productDeetailService";
import { addToCart as addToCartService } from "../../services/userWebService";
import "../../css/shop/fontStyle.css";
import "../../css/bootstrap/bootstrap.min.css";
import "../../css/bootstrap/magnific-popup.css";
import "../../css/bootstrap/jquery-ui.css";
import "../../css/bootstrap/owl.carousel.min.css";
import "../../css/bootstrap/owl.theme.default.min.css";
import "../../css/bootstrap/aos.css";
import "../../css/shop/style.css";
import { FaUser } from "react-icons/fa";
import { HiShoppingCart } from "react-icons/hi";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import "../../css/Detail.css";

const Detail = () => {
  const { productId } = useParams();
  const [productDetails, setProductDetails] = useState([]);
  const [cart, setCart] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const token = localStorage.getItem("token");
  useEffect(() => {
    const loadProductDetails = async () => {
      if (token) {
        const numericProductId = Number(productId);
        const details = await fetchProductDetails(numericProductId, token);
        setProductDetails(details);
      }
    };
    loadProductDetails();
  }, [productId]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = productDetails.slice(indexOfFirstItem, indexOfLastItem);

  const addToCart = async (product) => {
    try {
      const token = localStorage.getItem("token"); // Get the token from localStorage
      if (!token) {
        throw new Error("User is not authenticated");
      }

      const dataCart = {
        pd_Id: product.pd_Id,
        c_Id: product.c_Id,
        quantity: 1,
      };

      // Call the addToCart service to make the API request
      const updatedCart = addToCartService(token, dataCart);

      // After successfully adding to the cart, update localStorage
      setCart((prevCart) => {
        const newCart = [...prevCart, product];
        localStorage.setItem("cart", JSON.stringify(newCart));
        return newCart;
      });
    } catch (error) {
      console.error("Failed to add product to cart:", error);
      // Handle the error, maybe show a user notification
    }
  };

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Calculate total pages
  const totalPages = Math.ceil(productDetails.length / itemsPerPage);
  console.log(localStorage.getItem(cart));

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
                        <Link to={"/login"} className="site-cart">
                          {token ? (
                            <span>Đăng xuất</span>
                          ) : (
                            <span>Đăng nhập</span>
                          )}
                        </Link>
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
                <li className="active">
                  <Link to="/shop">CỬA HÀNG</Link>
                </li>
                <li>
                  <Link to="/cart">GIỎ HÀNG</Link>
                </li>
              </ul>
            </div>
          </nav>
        </header>

        <main className="product-details">
          <h2>Chi tiết sản phẩm</h2>
          <div className="row">
            {currentItems.length > 0 ? (
              currentItems.map((detail, index) => (
                <div key={index} className="col-md-4 mb-4">
                  <div className="product-card">
                    <img
                      src={`data:image/jpeg;base64,${
                        detail.image || "placeholder.jpg"
                      }`}
                      alt={detail.code}
                      className="product-image"
                    />
                    <div
                      className="product-info"
                      style={{ textAlign: "center" }}
                    >
                      <h3 className="product-name">{detail.color}</h3>
                      <p className="product-description">
                        Mã Sản phẩm {detail.code}
                      </p>
                      <p className="product-price">Còn lại {detail.quantity}</p>
                      <button
                        className="btn btn-primary"
                        onClick={() => addToCart(detail)}
                      >
                        Thêm vào giỏ hàng
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No product details available.</p>
            )}
          </div>

          {/* Pagination buttons */}
          <div className="pagination">
            <button
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Trang trước
            </button>
            <span>
              Trang {currentPage} / {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Trang sau
            </button>
          </div>
        </main>

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

export default Detail;
