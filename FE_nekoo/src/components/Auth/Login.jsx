import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/authService"; // Import service
import "../../css/Login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await login(username, password);
      console.log("Login successful:", data);

      // Lưu Bearer token và roleName vào localStorage
      localStorage.setItem("userId", data.values.userId);
      localStorage.setItem("token", data.values.token);
      localStorage.setItem("roleName", data.values.roleName);

      // Điều hướng theo roleName
      if (data.values.roleName === "MANAGER") {
        navigate("/manageStaff");
      } else if (data.values.roleName === "STAFF") {
        navigate("/manageCustomer");
      } else if (data.values.roleName === "CUSTOMER") {
        navigate("/shop");
      }
    } catch (err) {
      setError(err.response.data.message);
      console.error("Login failed:", err);
    }
  };

  const handleRegisterRedirect = () => {
    navigate("/registor");
  };

  return (
    <div className="container_login">
      <div className="form-container">
        <h2>Nekoo Shop</h2>
        <form onSubmit={handleLogin} className="form">
          <div className="input-group">
            <label>Tên đăng nhập</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit" className="button">
            Đăng nhập
          </button>
          <span className="register-link" onClick={handleRegisterRedirect}>
            Bạn chưa có tài khoản, Đăng kí ngay!!!
          </span>
        </form>
      </div>
    </div>
  );
};

export default Login;
