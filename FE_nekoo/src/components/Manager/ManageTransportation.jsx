import { useEffect, useState } from "react";
import "../../css/ManageTransportation.css";
import SidebarManager from "../../Layout/SidebarManager";
import {
  loadTransportations,
  saveTransportation,
  disableTransportation,
} from "../../services/transportationService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAuthorization from "../../hooks/useAuthorization";
import { Modal, Button } from "react-bootstrap";

const ManageTransportation = () => {
  useAuthorization(["MANAGER"]);
  const [transportations, setTransportations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [newTransportationName, setNewTransportationName] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [selectedTransportation, setSelectedTransportation] = useState(null);
  const [newTransportationNameUpdate, setNewTransportationNameUpdate] =
    useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    loadTransportationsData();
  }, []);

  const loadTransportationsData = async () => {
    let loadingTimeout;

    loadingTimeout = setTimeout(() => {
      setLoading(true);
    }, 300);

    try {
      const token = localStorage.getItem("token");
      const data = await loadTransportations(token);
      setTransportations(data);
    } catch (error) {
      console.error("Không thể load phương tiện:", error);
      toast.error("Không thể load phương tiện!");
    } finally {
      clearTimeout(loadingTimeout);
      setLoading(false);
    }
  };

  const toggleAddForm = () => {
    setShowAddForm((prev) => !prev);
    setShowUpdateForm(false); // Hide update form if it’s open
    setNewTransportationName(""); // Reset add form fields
  };

  const handleAddTransportation = async () => {
    if (newTransportationName) {
      try {
        const token = localStorage.getItem("token");
        await saveTransportation(token, {
          name: newTransportationName,
          status: "true",
        });
        toast.success("Thêm mới phương tiện thành công!");
        setShowAddForm(false);
        loadTransportationsData(); // Refresh list
      } catch (error) {
        console.error("Thêm mới phương tiện thất bại:", error);
        toast.error("Thêm mới phương tiện thất bại!");
      }
    } else {
      toast.warning("Vui lòng nhập tên phương tiện.");
    }
  };

  const handleSelectTransportation = (transportation) => {
    setSelectedTransportation(transportation);
    setNewTransportationNameUpdate(transportation.name);
    setShowUpdateForm(true);
    setShowAddForm(false);
  };
  console.log(selectedTransportation);
  const handleUpdateTransportation = async () => {
    if (selectedTransportation && newTransportationNameUpdate) {
      try {
        const token = localStorage.getItem("token");
        await saveTransportation(token, {
          ...selectedTransportation,
          name: newTransportationNameUpdate,
        });
        toast.success("Cập nhật phương tiện thành công!");
        setShowUpdateForm(false);
        loadTransportationsData();
      } catch (error) {
        console.error("Failed to update transportation:", error);
        toast.error("Cập nhật phương tiện thất bại!");
      }
    } else {
      toast.warning("Vui lòng nhập tên phương tiện.");
    }
  };

  const handleToggleTransportationStatus = async (
    transportationId,
    isCurrentlyActive
  ) => {
    try {
      const token = localStorage.getItem("token");
      await disableTransportation(transportationId, token);
      toast.success(
        isCurrentlyActive
          ? "Vô hiệu hoá phương tiện thành công!"
          : "Kích hoạt phương tiện thành công!"
      );
      loadTransportationsData(); // Refresh list
    } catch (error) {
      console.error("Failed to toggle transportation status:", error);
      toast.error("Lỗi khi thay đổi trạng thái phương tiện!");
    }
  };

  const filteredTransportations = transportations.filter((transportation) =>
    transportation.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTransportations.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredTransportations.length / itemsPerPage);

  return (
    <>
      <div className="row">
        <div className="col-md-2">
          <SidebarManager />
        </div>
        <div className="col-md-10">
          <div className="container">
            <h2>Quản lý phương tiện</h2>
            <div className="top-controls">
              <Button variant="primary" onClick={toggleAddForm}>
                Thêm mới phương tiện
              </Button>
              <input
                type="text"
                placeholder="Tìm kiếm phương tiện... (Tên)"
                className="form-control search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <table className="table transportation-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Tên phương tiện</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.length > 0 ? (
                    currentItems.map((transportation) => (
                      <tr key={transportation.t_id}>
                        <td>{transportation.t_id}</td>
                        <td>{transportation.name}</td>
                        <td>
                          {transportation.status ? (
                            <span className="badge bg-success">Hoạt động</span>
                          ) : (
                            <span className="badge bg-danger">Vô hiệu hóa</span>
                          )}
                        </td>
                        <td className="d-flex justify-content-around">
                          <button
                            className="btn btn-warning"
                            onClick={() =>
                              handleSelectTransportation(transportation)
                            }
                          >
                            Cập nhật
                          </button>
                          <button
                            className="btn btn-danger"
                            onClick={() =>
                              handleToggleTransportationStatus(
                                transportation.t_id,
                                transportation.status === "true"
                              )
                            }
                          >
                            {transportation.status === "true"
                              ? "Vô hiệu hoá"
                              : "Kích hoạt"}
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8">Không tìm thấy phương tiện!</td>
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

            {/* Add Transportation Modal */}
            <Modal show={showAddForm} onHide={() => setShowAddForm(false)}>
              <Modal.Header closeButton>
                <Modal.Title>Thêm phương tiện</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <label>Tên phương tiện:</label>
                <input
                  style={{ marginBottom: "10px" }}
                  type="text"
                  value={newTransportationName}
                  onChange={(e) => setNewTransportationName(e.target.value)}
                  className="form-control"
                  required
                />
                <Button variant="primary" onClick={handleAddTransportation}>
                  Thêm mới phương tiện
                </Button>
              </Modal.Body>
            </Modal>

            {/* Update Transportation Modal */}
            <Modal
              show={showUpdateForm}
              onHide={() => setShowUpdateForm(false)}
            >
              <Modal.Header closeButton>
                <Modal.Title>Cập nhật phương tiện</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <label>Tên phương tiện:</label>
                <input
                  style={{ marginBottom: "10px" }}
                  type="text"
                  value={newTransportationNameUpdate}
                  onChange={(e) =>
                    setNewTransportationNameUpdate(e.target.value)
                  }
                  className="form-control"
                  required
                />
                <Button variant="primary" onClick={handleUpdateTransportation}>
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

export default ManageTransportation;
