import { useEffect, useState } from "react";
//service
import { loadShop } from "../../services/userWebService";
import { loadCategoriesAvailable } from "../../services/categoryService";
import { Link, useNavigate } from "react-router-dom";

//css
import "../../css/shop/fontStyle.css";
import "../../css/bootstrap/bootstrap.min.css";
import "../../css/bootstrap/magnific-popup.css";
import "../../css/bootstrap/jquery-ui.css";
import "../../css/bootstrap/owl.carousel.min.css";
import "../../css/bootstrap/owl.theme.default.min.css";
import "../../css/bootstrap/aos.css";
import "../../css/shop/style.css";
import "../../css/pageShop.css";

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
  const token = localStorage.getItem("token");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPriceRange, setSelectedPriceRange] = useState("");
  const [priceRange, setPriceRange] = useState({ minPrice: "", maxPrice: "" });
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts(
      currentPage,
      pageSize,
      sortKey,
      sortOrder,
      searchName,
      selectedCategory,
      priceRange.minPrice,
      priceRange.maxPrice
    );
    fectCategories();
  }, [currentPage, sortKey, sortOrder, selectedCategory, priceRange]);

  const fectCategories = async () => {
    const categoriesData = await loadCategoriesAvailable(token);
    setCategories(categoriesData);
  };

  const fetchProducts = async (
    currentPage,
    pageSize,
    sortKey,
    sortOrder,
    searchName,
    c_id,
    minPrice,
    maxPrice
  ) => {
    const token = localStorage.getItem("token");
    try {
      const productList = await loadShop(
        token,
        currentPage,
        pageSize,
        sortKey,
        sortOrder,
        searchName,
        c_id,
        minPrice,
        maxPrice
      );
      setProducts(productList);
      setTotalPages(productList.page.totalPages); // Set tổng số trang
      setCurrentPage(productList.page.number);
    } catch (error) {
      console.error("Lỗi khi tải sản phẩm:", error);
    }
  };

  useEffect(() => {
    fetchProducts(
      0,
      pageSize,
      sortKey,
      sortOrder,
      searchName,
      selectedCategory,
      priceRange.minPrice,
      priceRange.maxPrice
    );
    setCurrentPage(0);
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
  const handlePriceRangeChange = (e) => {
    if (e == "0-100000") {
      setPriceRange({ minPrice: 0, maxPrice: 100000 });
    } else if (e == "100000-500000") {
      setPriceRange({ minPrice: 100000, maxPrice: 500000 });
    } else if (e == "500000-1000000") {
      setPriceRange({ minPrice: 500000, maxPrice: 1000000 });
    } else if (e == "1000000") {
      setPriceRange({ minPrice: 1000000, maxPrice: "" });
    } else {
      setPriceRange({ minPrice: "", maxPrice: "" });
    }
    setSelectedPriceRange(e);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const formatCurrency = (number) => {
    return number
      .toLocaleString("vi-VN", { style: "currency", currency: "VND" })
      .replace("₫", "")
      .trim();
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
                <li>
                  <Link to="/order">Đơn hàng</Link>
                </li>
              </ul>
            </div>
          </nav>
        </header>

        <div
          className="site-section"
          style={{ paddingBottom: "80px", paddingTop: "0" }}
        >
          <div className="container">
            <div className="row mb-5">
              <div className="col-md-12 order-2">
                <div className="row mb-5">
                  <h2 className="text-black h5">Tất Cả Sản Phẩm</h2>
                </div>

                {/* Bộ lọc và tìm kiếm */}
                <div className="filter-search-wrapper">
                  {/* Lọc */}
                  <div className="filter-wrapper">
                    {/* Sắp xếp theo tên hoặc giá */}
                    <select
                      value={`${sortKey},${sortOrder}`}
                      onChange={handleSortChange}
                    >
                      <option value="name,asc">Theo tên ⬆︎</option>
                      <option value="name,desc">Theo tên ⬇︎</option>
                      <option value="price.price,asc">Theo giá ⬆︎</option>
                      <option value="price.price,desc">Theo giá ⬇︎</option>
                    </select>

                    {/* Lọc theo category */}
                    <select
                      value={selectedCategory}
                      onChange={(e) => handleCategoryChange(e.target.value)}
                    >
                      <option value="">Tất cả danh mục</option>
                      {categories.map((category) => (
                        <option key={category.c_Id} value={category.c_Id}>
                          {category.name}
                        </option>
                      ))}
                    </select>

                    {/* Lọc theo khoảng giá */}
                    <select
                      style={{ minWidth: "250px" }}
                      value={selectedPriceRange}
                      onChange={(e) => handlePriceRangeChange(e.target.value)}
                    >
                      <option value="">Tất cả giá</option>
                      <option value="0-100000">Dưới 100,000 VND</option>
                      <option value="100000-500000">
                        100,000 - 500,000 VND
                      </option>
                      <option value="500000-1000000">
                        500,000 - 1,000,000 VND
                      </option>
                      <option value="1000000">Trên 1,000,000 VND</option>
                    </select>
                  </div>

                  {/* Tìm kiếm */}
                  <div style={{ height: "45px" }} className="search-wrapper">
                    <input
                      type="text"
                      placeholder="Tìm kiếm theo tên..."
                      value={searchName}
                      onChange={handleSearchChange}
                    />
                  </div>
                </div>

                {/* Hiển thị sản phẩm */}
                <div className="row mb-5">
                  {products?.content?.map((product) => (
                    <div key={product.p_id} className="col-sm-6 col-lg-4 mb-4">
                      <div className="block-4 text-center border">
                        <figure className="block-4-image">
                          <Link to={`/detail/${product.p_id}`}>
                            <img
                              src={`data:image/jpeg;base64,${product.productDetails[0]?.image}`}
                              alt="Hình Ảnh Sản Phẩm"
                              className="img-fluid"
                            />
                          </Link>
                        </figure>
                        <div className="block-4-text p-4">
                          <h3>
                            <Link to={`/detail/${product.p_id}`}>
                              {product.name || "Tên Sản Phẩm"}
                            </Link>
                          </h3>
                          <p className="mb-0">
                            {product.material || "Chất Liệu Sản Phẩm"}
                          </p>
                          <p className="text-primary font-weight-bold">
                            {formatCurrency(product.price || "Không có giá")}{" "}
                            VND
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Phân trang */}
                <div className="row">
                  <div className="col-md-12 text-center">
                    {totalPages > 0 && (
                      <div className="pagination">
                        <button onClick={prevPage} disabled={currentPage === 0}>
                          Trước
                        </button>
                        <span>
                          Trang {currentPage + 1} / {totalPages}
                        </span>
                        <button
                          onClick={nextPage}
                          disabled={currentPage === totalPages - 1}
                        >
                          Sau
                        </button>
                      </div>
                    )}
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
