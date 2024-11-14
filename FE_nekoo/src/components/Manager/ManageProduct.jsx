import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/ManageProduct.css";
import SidebarManager from "../../Layout/SidebarManager";
import useAuthorization from "../../hooks/useAuthorization";
import { toast, ToastContainer } from "react-toastify";
import {
  loadProducts,
  addProduct,
  updateProduct,
  updateProductVoucher,
  toggleProductStatus,
} from "../../services/productService";
import { fetchVouchersEnable } from "../../services/voucherService";
import { loadCategoriesAvailable } from "../../services/categoryService";
import "react-toastify/dist/ReactToastify.css";
import { Modal, Button } from "react-bootstrap"; // Import Modal and Button from react-bootstrap

const ManageProduct = () => {
  useAuthorization(["MANAGER"]);
  const [products, setProducts] = useState([]);
  const [vouchers, setVouchers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [newProduct, setNewProduct] = useState({
    name: "",
    material: "",
    vat: "",
    price: "",
    category: { c_Id: "" },
  });
  const [productDetails, setProductDetails] = useState([
    { size: "", color: "", quantity: "", image: null },
  ]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [showUpdateVoucherForm, setShowUpdateVoucherForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState({
    p_id: "",
    name: "",
    material: "",
    vat: "",
    price: "",
  });
  const [updateDiscount, setUpdateDiscount] = useState({
    voucherId: "",
    productId: "",
    startDate: "",
    endDate: "",
    quantity: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const productsData = await loadProducts(token);
      const categoriesData = await loadCategoriesAvailable(token);
      const voucherData = await fetchVouchersEnable(token);
      setVouchers(voucherData);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error("Không thể tải sản phẩm:", error);
      toast.error("Không thể tải danh sách sản phẩm!");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [token]);

  const handleProductClick = (productId) => {
    navigate(`/manageProductDetail/${productId}`);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "c_Id") {
      setNewProduct({ ...newProduct, category: { c_Id: value } });
    } else {
      setNewProduct({ ...newProduct, [name]: value });
    }
  };

  const handleDetailChange = (index, e) => {
    const { name, value, files } = e.target;
    const updatedDetails = [...productDetails];
    updatedDetails[index][name] = files ? files[0] : value;
    setProductDetails(updatedDetails);
  };

  const addProductDetail = () => {
    setProductDetails([
      ...productDetails,
      { size: "", color: "", quantity: "", image: null },
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addProduct(newProduct, productDetails, token); // Gọi hàm dịch vụ để thêm sản phẩm
      toast.success("Thêm sản phẩm thành công!");

      // Reset form state
      setNewProduct({
        name: "",
        material: "",
        vat: "",
        price: "",
        category: { c_Id: "" },
      });
      setProductDetails([{ size: "", color: "", quantity: "", image: null }]);
      setShowAddForm(false);

      fetchProducts();
    } catch (error) {
      console.error("Thêm sản phẩm không thành công", error);
      toast.error("Thêm sản phẩm không thành công!");
    }
  };
  //update
  const handleUpdateClick = (product) => {
    console.log(product);

    setSelectedProduct({
      p_id: product.p_id,
      name: product.name,
      material: product.material,
      vat: product.vat,
      price: product.price,
      status: product.status,
      category: { c_Id: product.category.c_Id },
    }); // Set the product details in selectedProduct state
    setShowUpdateForm(true); // Show the update modal
  };

  //update
  const handleUpdateVoucherClick = (product) => {
    setUpdateDiscount({
      ...updateDiscount,
      productId: product.p_id,
    });
    setShowUpdateVoucherForm(true);
  };

  const handleUpdateInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProduct(selectedProduct, token);
      toast.success("Cập nhật sản phẩm thành công!");
      setShowUpdateForm(false);
      fetchProducts(); // Refresh the product list after update
    } catch (error) {
      console.error("Cập nhật sản phẩm không thành công", error);
      toast.error("Cập nhật sản phẩm không thành công!");
    }
  };
  const handleUpdateVoucherSubmit = async (e) => {
    e.preventDefault();
    try {
      // Chuyển đổi startDate và endDate từ chuỗi sang ISO 8601 cho Instant
      const startDateInstant = new Date(updateDiscount.startDate).toISOString();
      const endDateInstant = new Date(updateDiscount.endDate).toISOString();

      const updatedDiscountData = {
        ...updateDiscount,
        startDate: startDateInstant,
        endDate: endDateInstant,
      };

      await updateProductVoucher(updatedDiscountData, token);
      setUpdateDiscount({
        voucherId: "",
        productId: "",
        startDate: "",
        endDate: "",
        quantity: "",
      });
      toast.success("Cập nhật mã giảm giá sản phẩm thành công!");
      setShowUpdateVoucherForm(false);
      fetchProducts(); // Làm mới danh sách sản phẩm sau khi cập nhật
    } catch (error) {
      console.error("Cập nhật mã giảm giá sản phẩm không thành công", error);
      toast.error("Cập nhật mã giảm giá sản phẩm không thành công!");
    }
  };
  //dis-enable
  const handleToggleStatus = async (productId) => {
    try {
      await toggleProductStatus(productId, token);
      toast.success("Cập nhật trạng thái sản phẩm thành công!");
      fetchProducts(); // Refresh the list to reflect the status change
    } catch (error) {
      console.error("Không thể cập nhật trạng thái sản phẩm", error);
      toast.error("Không thể cập nhật trạng thái sản phẩm!");
    }
  };

  const removeProductDetail = (index) => {
    const updatedDetails = productDetails.filter((_, i) => i !== index);
    setProductDetails(updatedDetails);
  };

  const filteredProduct = products.filter((member) =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProduct.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProduct.length / itemsPerPage);

  return (
    <>
      <div className="row">
        <div className="col-2">
          <SidebarManager />
        </div>

        <div className="col-10">
          <div className="container">
            <h2>Quản lý sản phẩm</h2>

            <div className="top-controls">
              <Button variant="primary" onClick={() => setShowAddForm(true)}>
                Thêm sản phẩm
              </Button>
              <input
                type="text"
                placeholder="Tìm kiếm..."
                className="form-control search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {loading ? (
              <p>Loading...</p>
            ) : (
              <table className="table table-bordered product-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Tên sản phẩm</th>
                    <th>Chất liệu</th>
                    <th>Thuế VAT</th>
                    <th>Giá</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.length > 0 ? (
                    currentItems.map((product) => (
                      <tr key={product.p_id}>
                        <td>{product.p_id}</td>
                        <td>
                          <span
                            onClick={() => handleProductClick(product.p_id)}
                            style={{ cursor: "pointer", color: "blue" }}
                          >
                            {product.name}
                          </span>
                        </td>
                        <td>{product.material}</td>
                        <td>{product.vat}</td>
                        <td>
                          {product.price
                            ? product.price
                            : "Không có giá để hiển thị"}
                        </td>
                        <td>
                          {product.status ? (
                            <span className="badge bg-success">Hiệu lực</span>
                          ) : (
                            <span className="badge bg-danger">
                              Hết hiệu lực
                            </span>
                          )}
                        </td>
                        <td className="d-flex justify-content-around">
                          <button
                            className="btn btn-warning"
                            onClick={() => handleUpdateClick(product)}
                          >
                            Cập nhật
                          </button>
                          <button
                            className="btn btn-info"
                            onClick={() => handleUpdateVoucherClick(product)}
                          >
                            Thêm voucher
                          </button>
                          <button
                            className="btn btn-danger"
                            onClick={() => handleToggleStatus(product.p_id)}
                          >
                            {product.status ? "Vô hiệu hóa" : "Kích hoạt"}
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7">Không có sản phẩm nào!</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}

            <div className="pagination">
              <button
                className="btn btn-secondary"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              >
                Trước
              </button>
              <span>
                Trang {currentPage} / {totalPages}
              </span>
              <button
                className="btn btn-secondary"
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
              >
                Sau
              </button>
            </div>

            {/* Modal for adding product */}
            <Modal show={showAddForm} onHide={() => setShowAddForm(false)}>
              <Modal.Header closeButton>
                <Modal.Title>Thêm mới sản phẩm</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <form onSubmit={handleSubmit}>
                  <label>
                    Tên sản phẩm:
                    <input
                      type="text"
                      name="name"
                      value={newProduct.name}
                      onChange={handleInputChange}
                      className="form-control"
                      required
                    />
                  </label>
                  <label>
                    Chất liệu:
                    <input
                      type="text"
                      name="material"
                      value={newProduct.material}
                      onChange={handleInputChange}
                      className="form-control"
                      required
                    />
                  </label>
                  <label>
                    Thuế VAT:
                    <input
                      type="number"
                      name="vat"
                      value={newProduct.vat}
                      onChange={handleInputChange}
                      className="form-control"
                      required
                    />
                  </label>
                  <label>
                    Giá:
                    <input
                      type="number"
                      name="price"
                      value={newProduct.price}
                      onChange={handleInputChange}
                      className="form-control"
                      required
                    />
                  </label>
                  <label>
                    Category ID:
                    <select>
                      <option value="">Chọn danh mục</option>
                      {categories.map((category) => (
                        <option key={category.c_Id} value={category.c_Id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </label>

                  {productDetails.map((detail, index) => (
                    <div key={index}>
                      <h4>Chi tiết sản phẩm {index + 1}</h4>
                      <label>
                        Kích cỡ:
                        <input
                          type="text"
                          name="size"
                          value={detail.size}
                          onChange={(e) => handleDetailChange(index, e)}
                          className="form-control"
                          required
                        />
                      </label>
                      <label>
                        Màu sắc:
                        <input
                          type="text"
                          name="color"
                          value={detail.color}
                          onChange={(e) => handleDetailChange(index, e)}
                          className="form-control"
                          required
                        />
                      </label>
                      <label>
                        Số lượng:
                        <input
                          type="number"
                          name="quantity"
                          value={detail.quantity}
                          onChange={(e) => handleDetailChange(index, e)}
                          className="form-control"
                          required
                        />
                      </label>
                      <label>
                        Hình ảnh:
                        <input
                          type="file"
                          name="image"
                          onChange={(e) => handleDetailChange(index, e)}
                        />
                      </label>
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => removeProductDetail(index)}
                      >
                        Xóa chi tiết
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={addProductDetail}
                  >
                    Thêm chi tiết sản phẩm
                  </button>

                  <button type="submit" className="btn btn-primary">
                    Lưu sản phẩm
                  </button>
                </form>
              </Modal.Body>
            </Modal>
            {/* Update Modal */}
            <Modal
              show={showUpdateForm}
              onHide={() => setShowUpdateForm(false)}
            >
              <Modal.Header closeButton>
                <Modal.Title>Cập nhật sản phẩm</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <form onSubmit={handleUpdateSubmit}>
                  <label>
                    Tên sản phẩm:
                    <input
                      type="text"
                      name="name"
                      value={selectedProduct.name}
                      onChange={handleUpdateInputChange}
                      className="form-control"
                      required
                    />
                  </label>
                  <label>
                    Chất liệu:
                    <input
                      type="text"
                      name="material"
                      value={selectedProduct.material}
                      onChange={handleUpdateInputChange}
                      className="form-control"
                      required
                    />
                  </label>
                  <label>
                    Thuế VAT:
                    <input
                      type="number"
                      name="vat"
                      value={selectedProduct.vat}
                      onChange={handleUpdateInputChange}
                      className="form-control"
                      required
                    />
                  </label>
                  <label>
                    Giá:
                    <input
                      type="number"
                      name="price"
                      value={selectedProduct.price}
                      onChange={handleUpdateInputChange}
                      className="form-control"
                      required
                    />
                  </label>
                  <button type="submit" className="btn btn-primary mt-3">
                    Cập nhật
                  </button>
                </form>
              </Modal.Body>
            </Modal>
            <Modal
              show={showUpdateVoucherForm}
              onHide={() => setShowUpdateVoucherForm(false)}
            >
              <Modal.Header closeButton>
                <Modal.Title>Cập nhật mã giảm giá sản phẩm</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <form onSubmit={handleUpdateVoucherSubmit}>
                  <label>
                    Mã giảm giá:
                    <select
                      style={{ margin: "0 67px 0 0" }}
                      name="voucherId"
                      value={updateDiscount.voucherId}
                      onChange={(e) =>
                        setUpdateDiscount({
                          ...updateDiscount,
                          voucherId: e.target.value,
                        })
                      }
                      className="form-control"
                      required
                    >
                      <option value="">Chọn mã giảm giá</option>
                      {vouchers.map((voucher) => (
                        <option key={voucher.v_id} value={voucher.v_id}>
                          {voucher.discount} VND
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Số lượng:
                    <input
                      type="number"
                      name="quantity"
                      value={updateDiscount.quantity}
                      onChange={(e) =>
                        setUpdateDiscount({
                          ...updateDiscount,
                          quantity: e.target.value,
                        })
                      }
                      className="form-control"
                      required
                    />
                  </label>
                  <div className="d-flex">
                    <label>
                      Ngày bắt đầu:
                      <input
                        style={{ margin: "0 110px 0 0" }}
                        type="date"
                        name="startDate"
                        value={updateDiscount.startDate}
                        onChange={(e) =>
                          setUpdateDiscount({
                            ...updateDiscount,
                            startDate: e.target.value,
                          })
                        }
                        className="form-control"
                        required
                      />
                    </label>
                    <label>
                      Ngày kết thúc:
                      <input
                        style={{ margin: "0 110px 0 0" }}
                        type="date"
                        name="endDate"
                        value={updateDiscount.endDate}
                        onChange={(e) =>
                          setUpdateDiscount({
                            ...updateDiscount,
                            endDate: e.target.value,
                          })
                        }
                        className="form-control"
                        required
                      />
                    </label>
                  </div>

                  <button type="submit" className="btn btn-primary">
                    Cập nhật voucher
                  </button>
                </form>
              </Modal.Body>
            </Modal>
          </div>
        </div>
      </div>

      <ToastContainer />
    </>
  );
};

export default ManageProduct;
