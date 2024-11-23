import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../../css/ManageOrderDetail.css";
import { loadOrderByCode, changeStatus } from "../../services/orderService";
import { toast, ToastContainer } from "react-toastify";

// Component chính hiển thị chi tiết đơn hàng
const OrderDetail = () => {
  const [order, setOrder] = useState({});
  const { code } = useParams();
  const [statusNow, setStatusNow] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = async (order) => {
    try {
      const token = localStorage.getItem("token");
      await changeStatus(order.o_id, statusNow, "cancelled", token);
      loadData();
      toast.success("Huỷ đơn hàng thành công!");
    } catch (error) {
      if (
        error.response.data.message ==
        "Trạng thái hiện tại không phù hợp để chuyển sang trạng thái này"
      ) {
        toast.error("Trạng thái đơn hàng hiện tại không thể huỷ đơn hàng");
        return;
      }
      console.error("Không thể thay đổi trạng thái:", error);
      toast.error("Không thể thay đổi trạng thái !");
    }
  };

  const loadData = async () => {
    const token = localStorage.getItem("token");
    const response = await loadOrderByCode(token, code);
    setStatusNow(response.status);
    if (response.status === "pending") {
      response.status = "Đang chờ xử lý!";
    } else if (response.status === "processing") {
      response.status = "Đang xử lý";
    } else if (response.status === "shipped") {
      response.status = "Đã vận chuyển";
    } else if (response.status === "completed") {
      response.status = "Đã hoàn thành";
    } else {
      response.status = "Đơn hàng đã bị huỷ";
    }
    setOrder(response);
  };

  function formatDateWithoutTimezone(dateString) {
    // Tách phần ngày và giờ từ chuỗi thời gian
    const datePart = dateString.split("T")[0]; // "2024-11-30"
    const timePart = dateString.split("T")[1];
    const time = timePart.split(".")[0]; // "00:00:00"

    return `${datePart} ${time}`; // Kết hợp ngày và giờ
  }

  // Chuyển số thành tiền
  const formatCurrency = (number) => {
    return number
      .toLocaleString("vi-VN", { style: "currency", currency: "VND" })
      .replace("₫", "")
      .trim();
  };

  return (
    <div className="order-detail">
      {order.code && (
        <>
          <div className="order-detail-left">
            <h2>Chi tiết đơn hàng: {order.code}</h2>
            <p>
              <strong>Người nhận:</strong> {order.customerName}
            </p>
            <p>
              <strong>Trạng thái đơn hàng:</strong>{" "}
              <span
                style={
                  order.status == "Đơn hàng đã bị huỷ" ? { color: "red" } : {}
                }
              >
                {order.status}
              </span>
            </p>
            <p>
              <strong>Số điện thoại:</strong> {order.phone}
            </p>
            <p>
              <strong>Tổng tiền:</strong> {formatCurrency(order.totalPrice)} VND
            </p>
            <p>
              <strong>Ngày đặt:</strong>{" "}
              {formatDateWithoutTimezone(order.createAt)}
            </p>
            <p>
              <strong>Địa chỉ nhận:</strong> {order.address}
            </p>
            {/* Hiển thị chi tiết sản phẩm */}
            <h3>Chi tiết sản phẩm</h3>
            {order.orderProductDetails &&
            order.orderProductDetails.length > 0 ? (
              order.orderProductDetails.map((productDetail, index) => (
                <div key={index} className="product-detail">
                  <p>
                    <strong>Tên sản phẩm:</strong>{" "}
                    {productDetail.productDetail_name}
                  </p>
                  <p>
                    <strong>Màu sắc:</strong> {productDetail.color}
                  </p>
                  <p>
                    <strong>Kích cỡ:</strong> {productDetail.size}
                  </p>
                  <p>
                    <strong>Số lượng:</strong> {productDetail.quantity}
                  </p>
                  <p>
                    <strong>Giá hiện tại:</strong>{" "}
                    {formatCurrency(productDetail.current_price)} VND
                  </p>
                </div>
              ))
            ) : (
              <p>Không có chi tiết sản phẩm.</p>
            )}
          </div>

          {/* Bên phải: Voucher và Thanh toán */}
          <div className="order-detail-right">
            {/* Hiển thị thông tin voucher */}
            <h3>Thông tin voucher</h3>
            {order.orderVouchers && order.orderVouchers.length > 0 ? (
              order.orderVouchers.map((voucher, index) => (
                <div key={index} className="voucher-detail">
                  <p>
                    <strong>ID Voucher:</strong> {voucher.voucherId}
                  </p>
                  <p>
                    <strong>Số lượng:</strong> {voucher.quantity}
                  </p>
                  <p>
                    <strong>Giảm:</strong> {voucher.discount}
                  </p>
                </div>
              ))
            ) : (
              <p>Không có voucher áp dụng.</p>
            )}

            {/* Hiển thị thông tin thanh toán */}
            <h3>Hoá đơn</h3>
            {order.payments && order.payments.length > 0 ? (
              order.payments.map((payment, index) => (
                <div key={index} className="payment-detail">
                  <p>
                    <strong>Giá hiện tại:</strong> {payment.totalPrice} VND
                  </p>
                  <p>
                    <strong>Tổng giảm giá:</strong> {payment.totalDiscount} VND
                  </p>
                  <p>
                    <strong>Tổng tiền:</strong>{" "}
                    {formatCurrency(payment.currentPrice)} VND
                  </p>
                </div>
              ))
            ) : (
              <p>Đơn hàng chưa hoàn thành.</p>
            )}
            {(statusNow == "pending" || statusNow == "processing") && (
              <button onClick={() => handleStatusChange(order)}>
                Huỷ đơn hàng
              </button>
            )}
          </div>
        </>
      )}
      {/* Bên trái: Thông tin đơn hàng và sản phẩm */}
      <ToastContainer />
    </div>
  );
};

export default OrderDetail;
