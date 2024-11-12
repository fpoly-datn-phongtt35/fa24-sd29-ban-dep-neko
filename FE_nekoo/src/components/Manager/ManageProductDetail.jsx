import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  fetchProductDetails,
  createProductDetail,
} from "../../services/productDeetailService";
import SidebarManager from "../../Layout/SidebarManager";
import { Modal, Button } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "../../css/ManageProductDetail.css";

const ManageProductDetail = () => {
  const { productId } = useParams();
  const [productDetails, setProductDetails] = useState([]);
  const [newDetail, setNewDetail] = useState({
    size: "",
    color: "",
    quantity: "",
    image: null,
  });
  const [showModal, setShowModal] = useState(false);
  const token = localStorage.getItem("token");

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Fetch product details
  useEffect(() => {
    const loadProductDetails = async () => {
      const details = await fetchProductDetails(productId, token);
      setProductDetails(details);
    };
    loadProductDetails();
  }, [productId, token]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Convert size and quantity to number when they change
    if (name === "size" || name === "quantity") {
      setNewDetail((prevDetail) => ({
        ...prevDetail,
        [name]: value ? Number(value) : "",
      }));
    } else {
      setNewDetail((prevDetail) => ({
        ...prevDetail,
        [name]: value,
      }));
    }
  };

  // Handle image input change
  const handleImageChange = (e) => {
    setNewDetail((prevDetail) => ({
      ...prevDetail,
      image: e.target.files[0],
    }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure all fields are valid (check that none are undefined or empty)
    if (
      !newDetail.size ||
      !newDetail.color ||
      !newDetail.quantity ||
      !newDetail.image
    ) {
      toast.error("Vui lòng điền đầy đủ thông tin và chọn hình ảnh!");
      return;
    }

    // Ensure size and quantity are valid numbers
    if (isNaN(newDetail.size) || isNaN(newDetail.quantity)) {
      toast.error("Kích thước và số lượng phải là số hợp lệ!");
      return;
    }

    // Prepare FormData to send to backend
    const formData = new FormData();
    formData.append("p_id", productId);
    formData.append("size", newDetail.size);
    formData.append("color", newDetail.color);
    formData.append("quantity", newDetail.quantity);
    formData.append("image", newDetail.image);

    // Call createProductDetail API
    const createdDetail = await createProductDetail(formData, token);
    if (createdDetail) {
      const updatedDetails = await fetchProductDetails(productId, token);
      setProductDetails(updatedDetails);
    }

    setNewDetail({
      size: "",
      color: "",
      quantity: "",
      image: null,
    });

    toast.success("Thêm chi tiết sản phẩm thành công!");
    setShowModal(false);
  };

  const filteredProductDetail = productDetails.filter((member) =>
    member.code.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProductDetail.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredProductDetail.length / itemsPerPage);

  return (
    <>
      <div className="row">
        <div className="col-2">
          <SidebarManager />
        </div>

        <div className="col-10">
          <div className="container">
            <h2>Chi tiết sản phẩm</h2>

            <div className="top-controls">
              <Button variant="primary" onClick={() => setShowModal(true)}>
                Thêm chi tiết sản phẩm
              </Button>
              <input
                type="text"
                placeholder="Tìm kiếm..."
                className="form-control search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="managepd-table mt-4">
              <table className="table table-bordered table-striped">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Mã</th>
                    <th>Kích cỡ</th>
                    <th>Màu</th>
                    <th>Số lượng</th>
                    <th>Ngày tạo</th>
                    <th>Người tạo</th>
                    <th>Ngày cập nhật</th>
                    <th>Người cập nhật</th>
                    <th>Hình ảnh</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.length > 0 ? (
                    currentItems.map((detail) => (
                      <tr key={detail.pd_Id} className="product-detail">
                        <td>{detail.pd_Id}</td>
                        <td>{detail.code}</td>
                        <td>{detail.size}</td>
                        <td>{detail.color}</td>
                        <td>{detail.quantity}</td>
                        <td>{new Date(detail.createAt).toLocaleString()}</td>
                        <td>{detail.createBy}</td>
                        <td>{new Date(detail.updateAt).toLocaleString()}</td>
                        <td>{detail.updateBy}</td>
                        <td>
                          {detail.image ? (
                            <img
                              src={`data:image/jpeg;base64,${detail.image}`}
                              alt="Product detail"
                              className="img-fluid"
                            />
                          ) : (
                            <p>Không có hình ảnh!</p>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="10">Sản phẩm không có chi tiết...</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

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
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
        >
          Sau
        </button>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Thêm chi tiết sản phẩm</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="form-group">
              <label>Kích cỡ</label>
              <input
                type="number"
                name="size"
                value={newDetail.size}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group">
              <label>Màu</label>
              <input
                type="text"
                name="color"
                value={newDetail.color}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group">
              <label>Số lượng</label>
              <input
                type="number"
                name="quantity"
                value={newDetail.quantity}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group">
              <label>Hình ảnh</label>
              <input
                type="file"
                name="image"
                onChange={handleImageChange}
                className="form-control"
                required
              />
            </div>
            <Button type="submit" variant="primary" className="mt-3">
              Thêm chi tiết sản phẩm
            </Button>
          </form>
        </Modal.Body>
      </Modal>

      <ToastContainer />
    </>
  );
};

export default ManageProductDetail;
