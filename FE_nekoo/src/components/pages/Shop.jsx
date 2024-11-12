import { useEffect, useState } from "react";
//service
import { loadShop } from "../../services/userWebService";
//css
import "../../css/shop/fontStyle.css";
import "../../css/bootstrap/bootstrap.min.css";
import "../../css/bootstrap/magnific-popup.css";
import "../../css/bootstrap/jquery-ui.css";
import "../../css/bootstrap/owl.carousel.min.css";
import "../../css/bootstrap/owl.theme.default.min.css";
import "../../css/bootstrap/aos.css";
import "../../css/shop/style.css";
//icon
import { FaUser } from "react-icons/fa";
import { HiShoppingCart } from "react-icons/hi";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [searchName, setSearchName] = useState(""); // Lưu trữ giá trị tìm kiếm
  const [sortKey, setSortKey] = useState("name"); // Sắp xếp theo trường (tên hoặc giá)
  const [sortOrder, setSortOrder] = useState("asc"); 
  let pageSize = 9;
  const [currentPage, setCurrentPage] = useState(0); // Trang hiện tại
  const [totalPages, setTotalPages] = useState(0); // Tổng số trang

  useEffect(() => {
      fetchProducts(currentPage, pageSize, sortKey, sortOrder, searchName);
  }, [currentPage, sortKey, sortOrder]);

  const fetchProducts = async (currentPage, pageSize, sortKey, sortOrder, searchName) => {
    const token = localStorage.getItem("token");
    try {
      const productList = await loadShop(token, currentPage, pageSize, sortKey, sortOrder, searchName);
      setProducts(productList);
      setTotalPages(productList.page.totalPages); // Set tổng số trang
      setCurrentPage(productList.page.number); // Cập nh
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts(0, pageSize, sortKey, sortOrder, searchName);
    setCurrentPage(0)
  }, [searchName]);

  // Hàm chuyển sang trang kế tiếp
  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Hàm quay lại trang trước
  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Hàm xử lý sự thay đổi của input tìm kiếm
  const handleSearchChange = (event) => {
    setSearchName(event.target.value);
  };

  // Hàm xử lý thay đổi sắp xếp
  const handleSortChange = (event) => {
    const [field, order] = event.target.value.split(",");
    setSortKey(field);
    setSortOrder(order);
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
                        <a href="#">
                          <FaUser />
                        </a>
                      </li>
                      <li>
                        <a href="cart.html" className="site-cart">
                          <HiShoppingCart />
                          <span className="count">2</span>
                        </a>
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
                  <a href="shop.html">SHOP</a>
                </li>
                <li>
                  <a href="cart.html">CART</a>
                </li>
                <li>
                  <a href="contact.html">CONTACT</a>
                </li>
              </ul>
            </div>
          </nav>
        </header>

        <div className="site-section">
          <div className="container">
            <div className="row mb-5">
              <div className="col-md-9 order-2">
                <div className="row">
                  <div className="col-md-12 mb-5">
                    <div className="float-md-left mb-4">
                      <h2 className="text-black h5">All Product</h2>
                    </div>
                  </div>
                </div>
                {/* Tìm kiếm */}
                <div>
                  <input
                    type="text"
                    placeholder="Search by name..."
                    value={searchName}
                    onChange={handleSearchChange}
                  />
                </div>

                {/* Sắp xếp */}
                <div>
                  <select value={`${sortKey},${sortOrder}`} onChange={handleSortChange}>
                    <option value="name,asc">Theo tên ⬆︎</option>
                    <option value="name,desc">Theo tên ⬇︎</option>
                    <option value="price.price,asc">theo giá ⬆︎</option>
                    <option value="price.price,desc">Theo giá ⬇︎</option>
                  </select>
                </div>
                <div className="row mb-5">
                  {products?.content?.map((product) => (
                    <div
                      key={product.p_id}
                      className="col-sm-6 col-lg-4 mb-4"
                    >
                      <div className="block-4 text-center border">
                        <figure className="block-4-image">
                          <a href="shop-single.html">
                            <img
                              src={`data:image/jpeg;base64,${product.productDetails[0]?.image}`}
                              alt="Product Image"
                              className="img-fluid"
                            />
                          </a>
                        </figure>
                        <div className="block-4-text p-4">
                          <h3>
                            <a href="shop-single.html">
                              {product.name || "Product Name"}
                            </a>
                          </h3>
                          <p className="mb-0">
                            {product.material || "Product Material"}
                          </p>
                          <p className="text-primary font-weight-bold">
                            $ {product.price || "Price not available"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="row">
                  <div className="col-md-12 text-center">
                    {/* Phân trang */}
                    {totalPages > 0 &&
                      <div className="pagination">
                      <button onClick={prevPage} disabled={currentPage === 0}>
                        Trước
                      </button>
                      <span>
                        Trang {currentPage + 1} / {totalPages}
                      </span>
                      <button onClick={nextPage} disabled={currentPage === totalPages - 1}>
                        Sau
                      </button>
                    </div>
                    }
                      
                  </div>
                </div>
              </div>
              <div className="col-md-3 order-1 mb-5 mb-md-0">
                <div className="border p-4 rounded mb-4">
                  <h3 className="mb-3 h6 text-uppercase text-black d-block">
                    Categories
                  </h3>
                  <ul className="list-unstyled mb-0">
                    <li className="mb-1">
                      <a href="#" className="d-flex">
                        <span>Men</span>{" "}
                        <span className="text-black ml-auto">(2,220)</span>
                      </a>
                    </li>
                    <li className="mb-1">
                      <a href="#" className="d-flex">
                        <span>Women</span>{" "}
                        <span className="text-black ml-auto">(2,550)</span>
                      </a>
                    </li>
                    <li className="mb-1">
                      <a href="#" className="d-flex">
                        <span>Children</span>{" "}
                        <span className="text-black ml-auto">(2,124)</span>
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="border p-4 rounded mb-4">
                  <div className="mb-4">
                    <h3 className="mb-3 h6 text-uppercase text-black d-block">
                      Filter by Price
                    </h3>
                    <div id="slider-range" className="border-primary" />
                    <input
                      type="text"
                      name="text"
                      id="amount"
                      className="form-control border-0 pl-0 bg-white"
                      disabled=""
                    />
                  </div>
                  <div className="mb-4">
                    <h3 className="mb-3 h6 text-uppercase text-black d-block">
                      Size
                    </h3>
                    <label htmlFor="s_sm" className="d-flex">
                      <input type="checkbox" id="s_sm" className="mr-2 mt-1" />{" "}
                      <span className="text-black">Small (2,319)</span>
                    </label>
                    <label htmlFor="s_md" className="d-flex">
                      <input type="checkbox" id="s_md" className="mr-2 mt-1" />{" "}
                      <span className="text-black">Medium (1,282)</span>
                    </label>
                    <label htmlFor="s_lg" className="d-flex">
                      <input type="checkbox" id="s_lg" className="mr-2 mt-1" />{" "}
                      <span className="text-black">Large (1,392)</span>
                    </label>
                  </div>
                  <div className="mb-4">
                    <h3 className="mb-3 h6 text-uppercase text-black d-block">
                      Color
                    </h3>
                    <a
                      href="#"
                      className="d-flex color-item align-items-center"
                    >
                      <span className="bg-danger color d-inline-block rounded-circle mr-2" />{" "}
                      <span className="text-black">Red (2,429)</span>
                    </a>
                    <a
                      href="#"
                      className="d-flex color-item align-items-center"
                    >
                      <span className="bg-success color d-inline-block rounded-circle mr-2" />{" "}
                      <span className="text-black">Green (2,298)</span>
                    </a>
                    <a
                      href="#"
                      className="d-flex color-item align-items-center"
                    >
                      <span className="bg-info color d-inline-block rounded-circle mr-2" />{" "}
                      <span className="text-black">Blue (1,075)</span>
                    </a>
                    <a
                      href="#"
                      className="d-flex color-item align-items-center"
                    >
                      <span className="bg-primary color d-inline-block rounded-circle mr-2" />{" "}
                      <span className="text-black">Purple (1,075)</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
export default Shop;
