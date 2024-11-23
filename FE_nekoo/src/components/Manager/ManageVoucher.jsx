import { useEffect, useState } from "react";
import "../../css/ManageVoucher.css";
import SidebarManager from "../../Layout/SidebarManager";
import {
  fetchVouchers,
  disableVoucher,
  updateVoucher,
  addVoucher,
} from "../../services/voucherService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAuthorization from "../../hooks/useAuthorization";
import { Modal, Button } from "react-bootstrap";

const ManageVoucher = () => {
  useAuthorization(["MANAGER"]);
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [newVoucherDiscount, setNewVoucherDiscount] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [newDiscount, setNewDiscount] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    loadVouchers();
  }, []);

  const loadVouchers = async () => {
    let loadingTimeout;

    loadingTimeout = setTimeout(() => {
      setLoading(true); // Bật loading sau 300ms nếu dữ liệu chưa load xong
    }, 300);
    try {
      const data = await fetchVouchers();
      setVouchers(data);
    } catch (error) {
      console.error("Không thể load mã giảm giá:", error);
      toast.error("Không thể load danh sách mã giảm giá !");
    } finally {
      clearTimeout(loadingTimeout);
      setLoading(false);
    }
  };

  const toggleAddForm = () => {
    setShowAddForm((prev) => !prev);
    setShowUpdateForm(false); // Hide update form if it’s open
    setNewVoucherDiscount(""); // Reset add form fields
  };

  const handleAddVoucher = async () => {
    if (newVoucherDiscount) {
      if (newVoucherDiscount <= 0) {
        toast.error("Giá tiền giảm phải lớn hơn 0 !!!");
        return;
      }
      try {
        await addVoucher({ discount: newVoucherDiscount, status: 1 });
        toast.success("Thêm mới mã giảm giá thành công!");
        setShowAddForm(false);
        loadVouchers(); // Refresh list
      } catch (error) {
        console.error("Thêm mới mã thất bại:", error);
        toast.error("Thêm mới mã thất bại!");
      }
    } else {
      toast.error("Vui lòng nhập số tiền hợp lệ.");
    }
  };

  const handleSelectVoucher = (voucher) => {
    setSelectedVoucher(voucher);
    setNewDiscount(voucher.discount);
    setShowUpdateForm(true);
    setShowAddForm(false);
  };

  const handleUpdateVoucher = async () => {
    if (selectedVoucher && newDiscount) {
      if (newDiscount <= 0) {
        toast.error("Giá tiền giảm phải lớn hơn 0 !!!");
        return;
      }
      try {
        await updateVoucher(selectedVoucher.v_id, parseFloat(newDiscount));
        toast.success("Cập nhật mã giảm giá thành công!");
        setShowUpdateForm(false);
        loadVouchers();
      } catch (error) {
        console.error("Failed to update voucher:", error);
        toast.error("Cập nhật mã giảm giá thất bại!");
      }
    } else {
      toast.error("Vui lòng nhập số tiền hợp lệ.");
    }
  };

  const handleToggleVoucherStatus = async (voucherId, isCurrentlyActive) => {
    try {
      await disableVoucher(voucherId);
      // setVouchers((prev) =>
      //   prev.map((voucher) =>
      //     voucher.v_id === voucherId
      //       ? { ...voucher, status: !isCurrentlyActive }
      //       : voucher
      //   )
      // );
      toast.success(
        isCurrentlyActive ? "Vô hiệu hoá thành công!" : "Kích hoạt thành công!"
      );
      loadVouchers();
    } catch (error) {
      console.error("Failed to toggle voucher status:", error);
      toast.error("Error toggling voucher status!");
    }
  };

  const filteredVouchers = vouchers.filter((voucher) =>
    voucher.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredVouchers.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredVouchers.length / itemsPerPage);

  // Chuyển số thành tiền
  const formatCurrency = (number) => {
    return number
      .toLocaleString("vi-VN", { style: "currency", currency: "VND" })
      .replace("₫", "")
      .trim();
  };

  return (
    <>
      <div className="row">
        <div className="col-md-2">
          <SidebarManager />
        </div>
        <div className="col-md-10">
          <div className="container">
            <h2>Quản lý mã giảm giá</h2>
            <div className="top-controls">
              <Button variant="primary" onClick={toggleAddForm}>
                Thêm mới mã
              </Button>
              <input
                type="text"
                placeholder="Tìm kiếm mã... (Mã)"
                className="form-control search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <table className="table voucher-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Mã</th>
                    <th>Giảm giá</th>
                    <th>Ngày tạo</th>
                    <th>Người tạo</th>
                    <th>Ngày cập nhật</th>
                    <th>Người cập nhật</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.length > 0 ? (
                    currentItems.map((voucher) => (
                      <tr key={voucher.v_id}>
                        <td>{voucher.v_id}</td>
                        <td>{voucher.code}</td>
                        <td>{formatCurrency(voucher.discount)} VND</td>
                        <td>{new Date(voucher.createAt).toLocaleString()}</td>
                        <td>{voucher.createBy}</td>
                        <td>{new Date(voucher.updateAt).toLocaleString()}</td>
                        <td>{voucher.updateBy}</td>
                        <td>
                          {voucher.status ? (
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
                            onClick={() => handleSelectVoucher(voucher)}
                          >
                            Cập nhật
                          </button>
                          <button
                            className="btn btn-danger"
                            onClick={() =>
                              handleToggleVoucherStatus(
                                voucher.v_id,
                                voucher.status
                              )
                            }
                          >
                            {voucher.status ? "Vô hiệu hoá" : "Kích hoạt"}
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9">Không tìm thấy mã giảm giá!</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}

            {/* pagination */}
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

            {/* Add Voucher Modal */}
            <Modal show={showAddForm} onHide={() => setShowAddForm(false)}>
              <Modal.Header>
                <Modal.Title>Thêm mã giảm giá</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <label>Giảm giá:</label>
                <input
                  style={{ marginBottom: "10px" }}
                  type="number"
                  value={newVoucherDiscount}
                  onChange={(e) => setNewVoucherDiscount(e.target.value)}
                  className="form-control"
                  required
                />
                <Button variant="primary" onClick={handleAddVoucher}>
                  Thêm mới mã
                </Button>
              </Modal.Body>
            </Modal>

            {/* Update Voucher Modal */}
            <Modal
              show={showUpdateForm}
              onHide={() => setShowUpdateForm(false)}
            >
              <Modal.Header>
                <Modal.Title>Cập nhật mã giảm giá</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <label>Giảm giá:</label>
                <input
                  style={{ marginBottom: "10px" }}
                  type="number"
                  value={newDiscount}
                  onChange={(e) => setNewDiscount(e.target.value)}
                  className="form-control"
                  required
                />
                <Button variant="primary" onClick={handleUpdateVoucher}>
                  Cập nhật
                </Button>
              </Modal.Body>
            </Modal>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default ManageVoucher;
