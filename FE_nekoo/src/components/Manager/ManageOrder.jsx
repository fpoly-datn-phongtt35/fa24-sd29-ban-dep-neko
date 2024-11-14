import React, { useEffect, useState } from "react";
import "../../css/ManageOrder.css";
import { changeStatus, loadOrders } from "../../services/orderService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAuthorization from "../../hooks/useAuthorization";

const ManagerOrder = () => {
  useAuthorization(["MANAGER"]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [currentPage, setCurrentPage] = useState(0); // Trang hiện tại
  const [totalPages, setTotalPages] = useState(0); // Tổng số trang

  useEffect(() => {
    loadData(null, currentPage);
  }, [currentPage]);

  const loadData = async (status, page) => {
    let loadingTimeout;

    loadingTimeout = setTimeout(() => {
      setLoading(true);
    }, 300);

    try {
      const token = localStorage.getItem("token");
      const data = await loadOrders(page, status, token);
      setOrders(data);
      setTotalPages(data.page.totalPages); // Set tổng số trang
      setCurrentPage(data.page.number); // Cập nh
    } catch (error) {
      console.error("Không thể tải danh sách đơn hàng:", error);
      toast.error("Không thể tải danh sách đơn hàng !");
    } finally {
      clearTimeout(loadingTimeout);
      setLoading(false);
    }
  };

  const handleStatusChange = async (order, e) => {
    try {
      const token = localStorage.getItem("token");
      await changeStatus(order.id, order.status, e.target.value, token);
      loadData();
    } catch (error) {
      console.error("Không thể thay đổi trạng thái:", error);
      toast.error("Không thể thay đổi trạng thái !");
    }
  };

  const handleFilterChange = (event) => {
    loadData(event.target.value, 0);
    setCurrentPage(0);
  };

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

  return (
    <>
      <div className="order-management">
        <h2>Order Management</h2>

        {/* Lọc trạng thái đơn hàng */}
        <label>
          Lọc trạng thái:
          <select onChange={handleFilterChange}>
            <option value="">All</option>
            <option value="pending">Chờ xử lý</option>
            <option value="processing">Đang xử lý</option>
            <option value="shipped">Đã vận chuyển</option>
            <option value="completed">Đã hoàn thành</option>
          </select>
        </label>

        {/* Hiển thị danh sách đơn hàng */}
        <div className="order-list">
          {orders?.content?.map((order) => (
            <div key={order.code} className="order-card">
              <h3>Order Code: {order.code}</h3>
              <p>Customer: {order.customerName}</p>
              <p>Transportation: {order.transportation}</p>
              <label>
                Status:
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order, e)}
                >
                  <option value="pending">Chờ xử lý</option>
                  <option value="processing">Đang xử lý</option>
                  <option value="shipped">Đã vận chuyển</option>
                  <option value="completed">Đã hoàn thành</option>
                </select>
              </label>
            </div>
          ))}
        </div>

        <div className="row">
          <div className="col-md-12 text-center">
            {/* Phân trang */}
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
        <ToastContainer />
      </div>
    </>
  );
};

export default ManagerOrder;
