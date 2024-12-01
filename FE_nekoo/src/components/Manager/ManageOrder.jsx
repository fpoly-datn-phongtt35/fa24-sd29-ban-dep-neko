import React, { useEffect, useState } from "react";
import { changeStatus, loadOrders } from "../../services/orderService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import useAuthorization from "../../hooks/useAuthorization";
import SidebarManager from "../../Layout/SidebarStaff";
import "../../css/ManageOrder.css";

const ManagerOrder = () => {
  useAuthorization(["STAFF", "CUSTOMER"]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0); // Trang hiện tại
  const [totalPages, setTotalPages] = useState(0); // Tổng số trang
  const navigate = useNavigate();
  const roleName = localStorage.getItem("roleName");
  const [code, setCode] = useState("");
  const [status, setStatus] = useState(null);
  const fullPart = location.pathname;
  const part = fullPart.split("/")[1];
  useEffect(() => {
    loadData(null, status, currentPage);
  }, [currentPage]);

  const loadData = async (code, status, page) => {
    let loadingTimeout;

    loadingTimeout = setTimeout(() => {
      setLoading(true);
    }, 300);

    try {
      let userId = null;
      if (part == "order") {
        userId = localStorage.getItem("userId");
      }
      const token = localStorage.getItem("token");
      const data = await loadOrders(userId, code, page, status, token);
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

  const handleDetail = (code) => {
    if (part == "order") {
      navigate(`/order/${code}`);
      return;
    }
    navigate(`/manageOrderDetail/${code}`);
  };

  const handleStatusChange = async (order, e) => {
    try {
      if (part == "order") {
        toast.error("Bạn không có quyền để thay đổi trạng thái!");
        return;
      }
      const token = localStorage.getItem("token");
      await changeStatus(order.o_id, order.status, e.target.value, token);
      loadData(code, status, currentPage);
      toast.success("Cập nhật trạng thái thành công!");
    } catch (error) {
      if (error.response.data.message == "Số lượng sản phẩm không đủ") {
        console.error(error.response.data.message);
        toast.error(error.response.data.message);
        return;
      }
      if (
        error.response.data.message ==
        "Trạng thái hiện tại không phù hợp để chuyển sang trạng thái này"
      ) {
        console.error(error.response.data.message);
        toast.error(error.response.data.message);
        return;
      }
      console.error("Không thể thay đổi trạng thái:", error);
      toast.error("Không thể thay đổi trạng thái !");
    }
  };

  const handleOnChangeSearch = (e) => {
    setCode(e.target.value);
    if (e.target.value.trim().length === 0) {
      loadData(null, status, currentPage);
    }
  };

  const handleFilterChange = (event) => {
    setStatus(event.target.value != "" ? event.target.value : null);
    loadData(code, event.target.value, 0);
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

  const handleSearch = () => {
    loadData(code, status, currentPage);
  };

  return (
    <>
      {part == "order" && (
        <>
          <div className="filter-wrapper">
            {/* Lọc trạng thái đơn hàng */}
            <label>
              Lọc trạng thái:
              <select onChange={handleFilterChange}>
                <option value="">Tất cả</option>
                <option value="pending">Chờ xử lý</option>
                <option value="processing">Đang xử lý</option>
                <option value="shipped">Đã vận chuyển</option>
                <option value="completed">Đã hoàn thành</option>
                <option value="cancelled">Đơn đã huỷ</option>
              </select>
            </label>

            {/* Tìm kiếm theo mã đơn hàng */}
            <div className="order-search">
              <input
                type="text"
                placeholder="Nhập mã đơn hàng"
                value={code}
                onChange={(e) => handleOnChangeSearch(e)}
              />
              <button onClick={() => handleSearch()}>Tìm kiếm</button>
            </div>
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              {/* Hiển thị danh sách đơn hàng */}
              <div
                className={`order-list ${
                  orders?.content?.length === 1 ? "single-order" : ""
                }`}
              >
                {orders?.content?.map((order) => {
                  let status;
                  if (order.status == "pending") {
                    status = "Chờ xử lý";
                  } else if (order.status == "processing") {
                    status = "Đang xử lý";
                  } else if (order.status == "shipped") {
                    status = "Đang vận chuyển";
                  } else if (order.status == "completed") {
                    status = "Đã nhận đơn";
                  } else {
                    status = "Đơn đã huỷ";
                  }

                  return (
                    <div key={order.code} className="order-card">
                      <h3>Mã đơn hàng: {order.code}</h3>
                      <p>Khách hàng: {order.customerName}</p>
                      <p>Số điện thoại: {order.phone}</p>
                      <p>Địa chỉ: {order.address}</p>
                      <label>
                        Trạng thái:{" "}
                        <span
                          style={status == "Đơn đã huỷ" ? { color: "red" } : {}}
                        >
                          {status}
                        </span>
                      </label>
                      <button
                        className="detail-button"
                        onClick={() => handleDetail(order.code)}
                      >
                        Chi tiết
                      </button>
                    </div>
                  );
                })}
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
            </>
          )}
        </>
      )}
      {part != "order" && roleName == "STAFF" && (
        <div className="row">
          <div className="col-md-2">
            <SidebarManager />
          </div>
          <div className="col-md-10">
            <div className="order-management">
              {part != "order" && <h2>Quản lý đơn hàng</h2>}

              {/* Lọc trạng thái đơn hàng */}
              <div className="filter-wrapper">
                {/* Lọc trạng thái đơn hàng */}
                <label>
                  Lọc trạng thái:
                  <select onChange={handleFilterChange}>
                    <option value="">Tất cả</option>
                    <option value="pending">Chờ xử lý</option>
                    <option value="processing">Đang xử lý</option>
                    <option value="shipped">Đã vận chuyển</option>
                    <option value="completed">Đã hoàn thành</option>
                    <option value="cancelled">Đơn đã huỷ</option>
                  </select>
                </label>

                {/* Tìm kiếm theo mã đơn hàng */}
                <div className="order-search">
                  <input
                    type="text"
                    placeholder="Nhập mã đơn hàng"
                    value={code}
                    onChange={(e) => handleOnChangeSearch(e)}
                  />
                  <button onClick={() => handleSearch()}>Tìm kiếm</button>
                </div>
              </div>

              {loading ? (
                <p>Loading...</p>
              ) : (
                <>
                  {/* Hiển thị danh sách đơn hàng */}
                  <div
                    className={`order-list ${
                      orders?.content?.length === 1 ? "single-order" : ""
                    }`}
                  >
                    {orders?.content?.map((order) => (
                      <div key={order.code} className="order-card">
                        <h3>Mã đơn hàng: {order.code}</h3>
                        <p>Khách hàng: {order.customerName}</p>
                        <p>Số điện thoại: {order.phone}</p>
                        <p>Địa chỉ: {order.address}</p>
                        {order.status == "cancelled" && (
                          <label>
                            Trạng thái:{" "}
                            <span style={{ color: "red" }}>Đơn đã huỷ</span>
                          </label>
                        )}
                        {order.status != "cancelled" && (
                          <label>
                            Trạng thái:
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
                        )}
                        <button
                          className="detail-button"
                          onClick={() => handleDetail(order.code)}
                        >
                          Chi tiết
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="row">
                    <div className="col-md-12 text-center">
                      {/* Phân trang */}
                      {totalPages > 0 && (
                        <div className="pagination">
                          <button
                            onClick={prevPage}
                            disabled={currentPage === 0}
                          >
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
                </>
              )}
            </div>
          </div>
        </div>
      )}
      {part == "manageOrder" && roleName == "CUSTOMER" && (
        <>
          <Navigate to="/unauthorized" />
        </>
      )}
      <ToastContainer />
    </>
  );
};

export default ManagerOrder;
