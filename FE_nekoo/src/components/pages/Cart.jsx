import { useEffect, useState } from "react";
import { loadCarts } from "../../services/userWebService"; // Import the cart service
import { Link } from "react-router-dom";
import "../../css/Cart.css";
import { FaUser } from "react-icons/fa";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const token = localStorage.getItem("token"); // Get token from local storage

  useEffect(() => {
    const fetchCart = async () => {
      if (token) {
        try {
          const cartData = await loadCarts(token); // Fetch cart details
          setCart(cartData); // Set the cart data to state
        } catch (error) {
          console.error("Error loading cart:", error);
        }
      }
    };
    fetchCart();
  }, [token]);
  console.log(cart);

  const removeFromCart = (productId) => {
    // Add logic to remove product from cart if needed
  };

  const handleCheckout = () => {
    // Logic for handling checkout
    alert("Thanh toán thành công???");
  };

  return (
    <div className="cart-page">
      <header className="site-navbar">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-12 text-center">
              <div className="site-logo">
                <Link to="/">Nekoo Shop</Link>
              </div>
            </div>
          </div>
        </div>
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
                  <p>{item.quantity}</p>
                  {/* <p>
                    {item.quantity} x {item.product.price} VND
                  </p> */}
                  <button
                    className="remove-btn"
                    onClick={() => removeFromCart(item.product.id)}
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>Giỏ hàng của bạn trống.</p>
        )}

        {cart.length > 0 && (
          <div className="cart-summary">
            <p>
              Tổng:{" "}
              {cart.reduce(
                (total, item) => total + item.price * item.quantity,
                0
              )}{" "}
              VND
            </p>
            <button onClick={handleCheckout} className="checkout-btn">
              Thanh toán
            </button>
          </div>
        )}
      </main>

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
    </div>
  );
};

export default Cart;
