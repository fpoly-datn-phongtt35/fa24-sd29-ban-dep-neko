import { useEffect, useState } from "react";
import "../../css/ManageCategory.css";
import SidebarManager from "../../Layout/SidebarManager";
import {
  loadCategories,
  saveCategory,
  disableCategory,
} from "../../services/categoryService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAuthorization from "../../hooks/useAuthorization";
import { Modal, Button } from "react-bootstrap";

const ManageCategory = () => {
  useAuthorization(["MANAGER"]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [newCategoryNameUpdate, setNewCategoryNameUpdate] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    loadCategoriesData();
  }, []);

  const loadCategoriesData = async () => {
    let loadingTimeout;

    loadingTimeout = setTimeout(() => {
      setLoading(true);
    }, 300);

    try {
      const token = localStorage.getItem("token");
      const data = await loadCategories(token);
      setCategories(data);
    } catch (error) {
      console.error("Không thể load danh mục:", error);
      toast.error("Không thể load danh mục !");
    } finally {
      clearTimeout(loadingTimeout);
      setLoading(false);
    }
  };

  const toggleAddForm = () => {
    setShowAddForm((prev) => !prev);
    setShowUpdateForm(false); // Hide update form if it’s open
    setNewCategoryName(""); // Reset add form fields
  };

  const handleAddCategory = async () => {
    if (newCategoryName) {
      try {
        const token = localStorage.getItem("token");
        await saveCategory(token, { name: newCategoryName, status: "true" });
        toast.success("Thêm mới danh mục thành công!");
        setShowAddForm(false);
        loadCategoriesData(); // Refresh list
      } catch (error) {
        console.error("Thêm mới danh mục thất bại:", error);
        toast.error("Thêm mới danh mục thất bại!");
      }
    } else {
      toast.error("Vui lòng nhập tên danh mục.");
    }
  };

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
    setNewCategoryNameUpdate(category.name);
    setShowUpdateForm(true);
    setShowAddForm(false);
  };

  const handleUpdateCategory = async () => {
    if (selectedCategory && newCategoryNameUpdate) {
      try {
        const token = localStorage.getItem("token");
        await saveCategory(token, {
          ...selectedCategory,
          name: newCategoryNameUpdate,
        });
        toast.success("Cập nhật danh mục thành công!");
        setShowUpdateForm(false);
        loadCategoriesData();
      } catch (error) {
        console.error("Failed to update category:", error);
        toast.error("Cập nhật danh mục thất bại!");
      }
    } else {
      toast.error("Vui lòng nhập tên danh mục.");
    }
  };

  const handleToggleCategoryStatus = async (categoryId, isCurrentlyActive) => {
    try {
      const token = localStorage.getItem("token"); // Lấy token từ localStorage
      await disableCategory(categoryId, token); // Gọi hàm disableCategory
      toast.success(
        isCurrentlyActive
          ? "Vô hiệu hoá danh mục thành công!"
          : "Kích hoạt danh mục thành công!"
      );
      loadCategoriesData(); // Refresh lại danh mục
    } catch (error) {
      console.error("Failed to toggle category status:", error);
      toast.error("Lỗi khi thay đổi trạng thái danh mục!");
    }
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCategories.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);

  return (
    <>
      <div className="row">
        <div className="col-md-2">
          <SidebarManager />
        </div>
        <div className="col-md-10">
          <div className="container">
            <h2>Quản lý danh mục</h2>
            <div className="top-controls">
              <Button variant="primary" onClick={toggleAddForm}>
                Thêm danh mục
              </Button>
              <input
                type="text"
                placeholder="Tìm kiếm danh mục... (Tên)"
                className="form-control search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <table className="table category-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Tên danh mục</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.length > 0 ? (
                    currentItems.map((category) => (
                      <tr key={category.c_Id}>
                        <td>{category.c_Id}</td>
                        <td>{category.name}</td>
                        <td>
                          {category.status === "true" ? (
                            <span className="badge bg-success">Hoạt động</span>
                          ) : (
                            <span className="badge bg-danger">Vô hiệu hóa</span>
                          )}
                        </td>
                        <td className="d-flex justify-content-around">
                          <button
                            className="btn btn-warning"
                            onClick={() => handleSelectCategory(category)}
                          >
                            Cập nhật
                          </button>
                          <button
                            className="btn btn-danger"
                            onClick={() =>
                              handleToggleCategoryStatus(
                                category.c_Id, // Đảm bảo sử dụng đúng c_Id
                                category.status === "true" // Chuyển "true"/"false" thành boolean
                              )
                            }
                          >
                            {category.status === "true"
                              ? "Vô hiệu hoá"
                              : "Kích hoạt"}
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8">Không tìm thấy danh mục!</td>
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

            {/* Add Category Modal */}
            <Modal show={showAddForm} onHide={() => setShowAddForm(false)}>
              <Modal.Header>
                <Modal.Title>Thêm danh mục</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <label>Tên danh mục:</label>
                <input
                  style={{ marginBottom: "10px" }}
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="form-control"
                  required
                />
                <Button variant="primary" onClick={handleAddCategory}>
                  Thêm danh mục
                </Button>
              </Modal.Body>
            </Modal>

            {/* Update Category Modal */}
            <Modal
              show={showUpdateForm}
              onHide={() => setShowUpdateForm(false)}
            >
              <Modal.Header>
                <Modal.Title>Cập nhật danh mục</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <label>Tên danh mục:</label>
                <input
                  style={{ marginBottom: "10px" }}
                  type="text"
                  value={newCategoryNameUpdate}
                  onChange={(e) => setNewCategoryNameUpdate(e.target.value)}
                  className="form-control"
                  required
                />
                <Button variant="primary" onClick={handleUpdateCategory}>
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

export default ManageCategory;
