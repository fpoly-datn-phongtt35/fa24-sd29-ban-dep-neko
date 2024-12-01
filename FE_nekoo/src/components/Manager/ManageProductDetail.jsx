import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  fetchProductDetails,
  createProductDetail,
  updateProductDetail, // Import the update function from your service
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
  const [isUpdate, setIsUpdate] = useState(false); // Track if it's an update
  const [selectedDetail, setSelectedDetail] = useState(null); // For holding selected detail
  const token = localStorage.getItem("token");

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Fetch product details
  useEffect(() => {
    const loadProductDetails = async () => {
      const details = await fetchProductDetails(productId, token);
      setProductDetails(details);
      console.log(details);
    };
    loadProductDetails();
  }, [productId, token]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
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

  // Handle form submit (for add/update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !newDetail.size ||
      !newDetail.color ||
      !newDetail.quantity ||
      !newDetail.image
    ) {
      toast.error("Vui lòng điền đầy đủ thông tin và chọn hình ảnh!");
      return;
    }

    const formData = new FormData();
    formData.append("p_id", productId);
    formData.append("size", newDetail.size);
    formData.append("color", newDetail.color);
    formData.append("quantity", newDetail.quantity);
    formData.append("image", newDetail.image);

    if (isUpdate) {
      const formDataUpdate = new FormData();
      formDataUpdate.append("pd_id", selectedDetail.pd_Id);
      formDataUpdate.append("p_id", productId);
      formDataUpdate.append("size", newDetail.size);
      formDataUpdate.append("code", selectedDetail.code);
      formDataUpdate.append("color", newDetail.color);
      formDataUpdate.append("quantity", newDetail.quantity);
      formDataUpdate.append("image", newDetail.image);
      formDataUpdate.append("status", selectedDetail.status)
      // Update existing product detail
      const updated = await updateProductDetail(formDataUpdate, token);
      if (updated) {
        toast.success("Cập nhật chi tiết sản phẩm thành công!");
      }
    } else {
      // Create new product detail
      const createdDetail = await createProductDetail(formData, token);
      if (createdDetail) {
        toast.success("Thêm chi tiết sản phẩm thành công!");
      }
    }

    // Reload product details
    const updatedDetails = await fetchProductDetails(productId, token);
    setProductDetails(updatedDetails);

    // Reset form and state
    setNewDetail({ size: "", color: "", quantity: "", image: null });
    setShowModal(false);
    setIsUpdate(false);
    setSelectedDetail(null);
  };

  // Handle update button click
  const handleUpdateClick = (detail) => {
    setSelectedDetail(detail);
    setNewDetail({
      size: detail.size,
      color: detail.color,
      quantity: detail.quantity,
      image: null,
    });
    setShowModal(true);
    setIsUpdate(true);
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
                    <th>Hành động</th>
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
                        <td>
                          <Button
                            variant="warning"
                            onClick={() => handleUpdateClick(detail)}
                          >
                            Cập nhật
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="11">Sản phẩm không có chi tiết...</td>
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
          <Modal.Title>
            {isUpdate ? "Cập nhật chi tiết sản phẩm" : "Thêm chi tiết sản phẩm"}
          </Modal.Title>
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
                className="form-control-file"
                required={!isUpdate} // Required only when adding
              />
            </div>
            <Button type="submit" variant="primary">
              {isUpdate ? "Cập nhật" : "Thêm"}
            </Button>
          </form>
        </Modal.Body>
      </Modal>
      <ToastContainer />
    </>
  );
};

export default ManageProductDetail;
