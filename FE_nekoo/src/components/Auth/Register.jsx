import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registor } from "../../services/authService"; // Import service
import "../../css/Registor.css";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [role, setRole] = useState("CUSTOMER");
  const [cccd, setCccd] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const data = await registor(
        username,
        password,
        name,
        phone,
        cccd,
        dob,
        gender,
        address,
        role
      );
      navigate("/login");
    } catch (err) {
      setError(err.response.data.message);
      console.error("Registor failed:", err);
    }
  };

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  return (
    <div className="container_registor">
      <div className="form-container">
        <h2>Nekoo Shop</h2>
        <form onSubmit={handleRegister} className="form">
          <div className="row">
            <div className="col-md-6">
              <div className="input-username">
                <label>
                  Tên đăng nhập<span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="form-control"
                  required
                />
              </div>
              <div className="input-password">
                <label>
                  Mật khẩu<span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-control"
                  required
                />
              </div>
              <div className="input-name">
                <label>Họ và tên</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-control"
                />
              </div>
              <div className="input-dob">
                <label>
                  Ngày sinh<span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="form-control"
                  required
                />
              </div>
            </div>

            <div className="col-md-6">
              <div className="input-phone">
                <label>Số điện thoại</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="form-control"
                />
              </div>
              <div className="input-cccd">
                <label>CCCD</label>
                <input
                  type="text"
                  value={cccd}
                  onChange={(e) => setCccd(e.target.value)}
                  className="form-control"
                />
              </div>
              <div className="input-address">
                <label>Địa chỉ</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="form-control"
                />
              </div>
              <div className="input-gender">
                <label>Giới tính</label>
                <div className="d-flex justify-content-around">
                  <label>
                    <input
                      style={{ marginRight: "5px" }}
                      type="radio"
                      name="gender"
                      value="true"
                      checked={gender === true}
                      onChange={() => setGender(true)} // Chọn Nam, giá trị true
                    />
                    Nam
                  </label>
                  <label>
                    <input
                      style={{ marginRight: "5px" }}
                      type="radio"
                      name="gender"
                      value="false"
                      checked={gender === false}
                      onChange={() => setGender(false)} // Chọn Nữ, giá trị false
                    />
                    Nữ
                  </label>
                </div>
              </div>
            </div>
          </div>

          {error && <p className="error">{error}</p>}
          <button type="submit" className="button btn btn-primary">
            Đăng ký
          </button>
          <span className="login-link" onClick={handleLoginRedirect}>
            Bạn đã có tài khoản, Đăng nhập ngay!!!
          </span>
        </form>
      </div>
    </div>
  );
};

export default Register;
