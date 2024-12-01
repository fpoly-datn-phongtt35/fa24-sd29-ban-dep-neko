import { useEffect, useState } from "react";
import {
  loadCarts,
  deleteCart,
  createOrder,
  updateCart,
} from "../../services/userWebService";
import { fetchVouchersEnable } from "../../services/voucherService";
import { loadTransportations } from "../../services/transportationService";
import { toast, ToastContainer } from "react-toastify";

import { Link, useNavigate } from "react-router-dom";
import "../../css/Cart.css";
import { FaUser } from "react-icons/fa";
import { HiShoppingCart } from "react-icons/hi";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [vouchers, setVouchers] = useState([]);
  const [showVouchersModal, setShowVouchersModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [proID, setProID] = useState("");
  const [showTransportModal, setShowTransportModal] = useState(false);
  const token = localStorage.getItem("token");
  const [selectedVoucherID, setSelectedVoucherId] = useState({
    productId: "",
    v_id: "",
  });
  const navigate = useNavigate();
  const [info, setInfo] = useState({ phone: "", address: "" });

  useEffect(() => {
    fetchCart();
  }, [token]);

  const fetchCart = async () => {
    if (token) {
      try {
        const cartData = await loadCarts(token);
        setCart(cartData);
      } catch (error) {
        console.error("Error loading cart:", error);
      }
    }
  };

  const fetchVouchers = async (productId, productDetailId) => {
    try {
      let voucherList = await fetchVouchersEnable(productId);
      if (voucherList.length > 0) {
        voucherList.map((voucher) => {
          voucher.voucherProducts?.map((item) => {
            // Kiểm tra nếu voucher của sản phẩm đã được áp dụng trong giỏ hàng
            if (
              cart.some(
                (item1) => item1.appliedVoucher?.productId === item.productId
              )
            ) {
              item.quantity = item.quantity - 1;
            }
            return item; // Đảm bảo luôn trả về item, dù điều kiện có thỏa mãn hay không
          });
        });
        setProID(productId);
        setVouchers(voucherList);
        setSelectedProduct(productDetailId);
        setShowVouchersModal(true);
        for (let index = 0; index < cart.length; index++) {
          if (cart[index].productDetailId == productDetailId) {
            if (cart[index].appliedVoucher) {
              setSelectedVoucherId({
                ...selectedVoucherID,
                v_id: cart[index].appliedVoucher?.v_id,
              });
            } else {
              setSelectedVoucherId({ ...selectedVoucherID, v_id: "" });
            }
            break;
          }
        }
      } else {
        toast.warning("Không có mã giảm giá nào áp dụng cho sản phẩm này");
      }
    } catch (error) {
      console.error("Error fetching vouchers:", error);
      toast.error("Không thể tải danh sách mã giảm giá.");
    }
  };

  const applyVoucherToProduct = (id) => {
    let voucher = vouchers.find((item) => item.v_id == id);

    if (id != "") {
      // Duyệt qua các voucherProducts
      for (let item of voucher.voucherProducts) {
        // Kiểm tra xem sản phẩm có trùng với sản phẩm được chọn không
        if (item.productId === proID) {
          // Kiểm tra xem số lượng voucher có lớn hơn 0 không
          if (item.quantity === 0) {
            toast.warning("Hết mã giảm giá, không thể áp dụng!");
            // setShowVouchersModal(false);
            return; // Dừng hoàn toàn hàm nếu hết voucher
          }
          // Nếu voucher còn, có thể tiếp tục xử lý ở đây
          // Thực hiện các hành động khác nếu cần
          break; // Thoát vòng lặp nếu tìm thấy voucher phù hợp
        }
      }
      voucher["productId"] = proID;
    }
    setSelectedVoucherId({ ...selectedVoucherID, v_id: id });
    // Nếu voucher có sẵn và còn số lượng, tiếp tục thực hiện các bước dưới đây

    if (selectedProduct) {
      const updatedCart = cart.map((item) =>
        item.productDetailId === selectedProduct
          ? { ...item, appliedVoucher: voucher }
          : item
      );
      setCart(updatedCart);
      setShowVouchersModal(false);
      toast.success(
        id !== ""
          ? "Áp dụng mã giảm giá thành công"
          : "Huỷ mã giảm giá thành công"
      );
    }
  };

  const removeFromCart = async (productId) => {
    if (!token) return;
    try {
      await deleteCart(token, productId);
      fetchCart();
      alert("Sản phẩm đã được xóa khỏi giỏ hàng.");
    } catch (error) {
      console.error("Error removing product from cart:", error);
      alert("Không thể xóa sản phẩm khỏi giỏ hàng. Vui lòng thử lại.");
    }
  };

  const handleQuantityChange = (quantity, value) => {
    // Cho phép người dùng nhập tự do mà không kiểm tra ngay lập tức
    const updatedCart = cart.map((item) => {
      if (item.productDetailId === value.productDetailId) {
        return { ...item, quantity: quantity }; // Tạm thời lưu giá trị người dùng đang nhập
      }
      return item;
    });
    setCart(updatedCart);
  };

  const handleQuantityBlur = async (quantity, cart) => {
    if (!token) return;
    if (isNaN(quantity) || quantity < 1) {
      toast.warning("Số lượng không hợp lệ. Vui lòng nhập số lớn hơn 0!");
      fetchCart();
      return;
    }
    if (quantity > cart.productQuantity) {
      toast.warning("Không đủ số lượng sản phẩm!");
      fetchCart();
      return;
    }
    const newCart = {
      c_Id: cart.cartId,
      pd_Id: cart.productDetailId,
      quantity: Number(quantity),
    };
    await updateCart(token, newCart);
    fetchCart();
  };

  const handleCheckout = async () => {
    if (!token) {
      alert("Bạn cần đăng nhập để tiếp tục!");
      return;
    }
    try {
      if (info.phone.trim().length < 1 || info.address.trim().length < 1) {
        toast.warning("Bạn cần nhập thông tin người nhận!");
        return;
      }

      let voucherMap = {};
      cart.forEach((item) => {
        if (item.appliedVoucher) {
          const voucherId = item.appliedVoucher.v_id;

          // Nếu voucherId đã tồn tại, cộng dồn quantity
          if (voucherMap[voucherId]) {
            voucherMap[voucherId].quantity++;
          } else {
            // Nếu chưa tồn tại, thêm mới vào map
            voucherMap[voucherId] = {
              productId: item.appliedVoucher.productId,
              voucherId,
              quantity: 1,
            };
          }
        }
      });

      // Chuyển object thành array
      let orderVouchers = Object.values(voucherMap); // Lọc ra những voucher hợp lệ
      const orderProductDetails = cart.map((item) => ({
        pd_Id: item.productDetailId,
        quantity: item.quantity,
        current_price: item.productPrice,
      }));

      const checkoutData = {
        phone: info.phone,
        address: info.address,
        orderVouchers: orderVouchers.length > 0 ? orderVouchers : null,
        orderProductDetails: orderProductDetails,
      };

      const orderResponse = await createOrder(token, checkoutData);

      if (orderResponse) {
        toast.success("Đặt đơn hàng thành công");
        setInfo({ phone: "", address: "" });
        setCart([]);
        setShowTransportModal(false);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Không thể thực hiện đặt hàng. Vui lòng thử lại.");
    }
  };

  function calculateTimeRemaining(endDate) {
    // Chuyển endDate sang đối tượng Date và điều chỉnh sang múi giờ Việt Nam (UTC+7)
    const targetDate = new Date(endDate);
    const vietnamTimezoneOffset = 7 * 60; // Múi giờ UTC+7 (phút)
    const vietnamTime = new Date(
      targetDate.getTime() + vietnamTimezoneOffset * 60 * 1000
    );

    const now = new Date();
    const nowInVietnam = new Date(
      now.getTime() + vietnamTimezoneOffset * 60 * 1000
    );

    const timeDifference = vietnamTime - nowInVietnam;

    if (timeDifference <= 0) {
      return "Thời gian đã hết.";
    }

    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor(
      (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
    );
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

    if (days > 0) {
      return `Ngày kết thúc: ${formatDateWithoutTimezone(endDate)}`;
    }

    if (hours > 0) {
      return `Còn lại ${hours} giờ, ${minutes} phút.`;
    } else if (minutes > 0) {
      return `Còn lại ${minutes} phút, ${seconds} giây.`;
    } else {
      return `Còn lại ${seconds} giây.`;
    }
  }

  function formatDateWithoutTimezone(dateString) {
    // Tách phần ngày và giờ từ chuỗi thời gian
    const datePart = dateString.split("T")[0]; // "2024-11-30"
    const timePart = dateString.split("T")[1];
    const time = timePart.split("Z")[0]; // "00:00:00"

    return `${datePart} ${time}`; // Kết hợp ngày và giờ
  }
  // Chuyển số thành tiền
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
    <div className="cart-page">
      <header className="site-navbar">
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
        <nav
          className="site-navigation text-right text-md-center"
          role="navigation"
        >
          <div className="container">
            <ul className="site-menu js-clone-nav d-none d-md-block">
              <li>
                <Link to="/shop">CỬA HÀNG</Link>
              </li>
              <li className="active">
                <Link to="/cart">GIỎ HÀNG</Link>
              </li>
              <li>
                <Link to="/order">Đơn hàng</Link>
              </li>
            </ul>
          </div>
        </nav>
      </header>

      <main className="cart-content">
        <h2>Giỏ hàng của bạn</h2>
        {cart.length > 0 ? (
          <div className="cart-items">
            {cart.map((item, index) => (
              <div key={index} className="cart-item">
                <img
                  src={`data:image/jpeg;base64,${item.productImg}`}
                  alt={item.productName}
                  className="cart-item-image"
                />
                <div className="cart-item-info">
                  <h3>{item.productName}</h3>
                  <p>
                    Giá: {formatCurrency(item.productPrice)} VND{" "}
                    {item.appliedVoucher && (
                      <span style={{ marginLeft: "30px", color: "red" }}>
                        Giảm: {formatCurrency(item.appliedVoucher?.discount)}{" "}
                        VND
                      </span>
                    )}
                  </p>
                  <div className="quantity-container">
                    <label htmlFor={`quantity-${index}`}>Số lượng: </label>
                    <input
                      type="number"
                      id={`quantity-${index}`}
                      min="1"
                      value={item.quantity}
                      className="quantity-input"
                      onChange={(e) =>
                        handleQuantityChange(e.target.value, item)
                      }
                      onBlur={(e) => handleQuantityBlur(e.target.value, item)}
                    />
                    <span style={{ marginLeft: "15px" }}>
                      Còn: {item.productQuantity} sản phẩm
                    </span>
                  </div>
                </div>
                <div className="cart-item-buttons">
                  <button
                    className="voucher-btn"
                    onClick={() =>
                      fetchVouchers(item.productId, item.productDetailId)
                    }
                  >
                    Áp mã giảm giá
                  </button>
                  <button
                    className="remove-btn"
                    onClick={() => removeFromCart(item.productDetailId)}
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ textAlign: "center" }}>Giỏ hàng của bạn trống.</p>
        )}

        {cart.length > 0 && (
          <div className="cart-summary">
            <p>
              Tổng:{" "}
              {formatCurrency(
                Math.max(
                  cart.reduce(
                    (total, item) =>
                      total +
                      (item.productPrice * item.quantity -
                        (item.appliedVoucher?.discount || 0)),
                    0
                  ),
                  0
                )
              )}{" "}
              VND
            </p>
            <button
              className="checkout-btn"
              onClick={() => setShowTransportModal(true)}
            >
              Đặt hàng
            </button>
          </div>
        )}
      </main>

      {showVouchersModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Chọn mã giảm giá</h2>
            <select
              value={selectedVoucherID.v_id}
              onChange={(e) => applyVoucherToProduct(e.target.value)}
            >
              <option value="">Mã giảm giá</option>
              {vouchers.map((item) => (
                <option key={item.v_id} value={item.v_id}>
                  {formatCurrency(item.discount)} VND / SP ----- Còn{" "}
                  {
                    item.voucherProducts?.find(
                      (item) => item.productId == proID
                    ).quantity
                  }{" "}
                  mã giảm giá -----{" "}
                  {calculateTimeRemaining(
                    item.voucherProducts?.find(
                      (item) => item.productId == proID
                    ).endDate
                  )}
                </option>
              ))}
            </select>
            <button
              onClick={() => setShowVouchersModal(false)}
              className="close-btn"
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      {showTransportModal && (
        <div className="modal">
          <div className="modal-content" style={{ maxWidth: "30%" }}>
            <h2>Nhập thông tin người nhận</h2>
            <label style={{ marginTop: "5%" }}>Số điện thoại người nhận</label>
            <input
              style={{ border: "2px solid gray", borderRadius: "5px" }}
              required
              type="text"
              value={info.phone}
              onChange={(e) => setInfo({ ...info, phone: e.target.value })}
            />
            <br />
            <label>Địa chỉ người nhận</label>
            <input
              style={{ border: "2px solid gray", borderRadius: "5px" }}
              required
              type="text"
              value={info.address}
              onChange={(e) => setInfo({ ...info, address: e.target.value })}
            />

            <button
              style={{ marginTop: "7%" }}
              onClick={() => handleCheckout()}
              className="close-btn"
            >
              Xác nhận
            </button>
            <button
              style={{ backgroundColor: "gray" }}
              onClick={() => setShowTransportModal(false)}
            >
              Huỷ
            </button>
          </div>
        </div>
      )}

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
      <ToastContainer />
    </div>
  );
};

export default Cart;
