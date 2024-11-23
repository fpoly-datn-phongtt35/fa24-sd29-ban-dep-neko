import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registor } from "../../services/authService"; // Import service
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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

  const validateForm = () => {
    console.log(username);
    console.log(password);
    console.log(name);
    console.log(dob);
    console.log(phone);
    console.log(gender);
    console.log(address);
    console.log(cccd);
    // Danh sách các trường bắt buộc
    const requiredFields = [
      { value: username, message: "Tên đăng nhập không được để trống." },
      { value: password, message: "Mật khẩu không được để trống." },
      { value: name, message: "Họ và tên không được để trống." },
      { value: dob, message: "Ngày sinh không được để trống." },
      { value: phone, message: "Số điện thoại không được để trống." },
      { value: cccd, message: "CCCD không được để trống." },
      { value: address, message: "Địa chỉ không được để trống." },
    ];

    // Kiểm tra nếu có trường nào trống
    for (const field of requiredFields) {
      if (!field.value) {
        toast.error(field.message);
        return false;
      }
    }

    // Các kiểm tra regex
    const regexValidations = [
      {
        regex: /^[a-zA-Z0-9_]{3,}$/,
        value: username,
        message: "Tên đăng nhập ít nhất 3 kí tự, không chứa kí tự đặc biệt.",
      },
      {
        regex: /^[a-zA-Z0-9\s.,!?()&'-]*$/,
        value: name,
        message: "Họ và tên không được chứa ký tự đặc biệt.",
      },
      {
        regex: /^[a-zA-Z0-9\s.,!?()&'-]*$/,
        value: address,
        message: "Địa chỉ không được chứa ký tự đặc biệt.",
      },
      {
        regex: /^[0-9]{10}$/,
        value: phone,
        message: "Số điện thoại không hợp lệ (10 chữ số).",
      },
      {
        regex: /^[0-9]{12}$/,
        value: cccd,
        message: "Số CCCD không hợp lệ (12 chữ số).",
      },
    ];

    for (const validation of regexValidations) {
      if (!validation.regex.test(validation.value)) {
        toast.error(validation.message);
        return false;
      }
    }

    // Kiểm tra ngày sinh
    const dateOfBirth = new Date(dob);
    if (isNaN(dateOfBirth.getTime())) {
      toast.error("Ngày sinh không hợp lệ.");
      return false;
    }

    return true;
  };

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const data = await registor(
        username,
        password,
        name,
        phone,
        cccd,
        new Date(dob).toISOString(),
        gender,
        address,
        role
      );

      // Hiển thị toast thông báo thành công
      toast.success("Đăng ký tài khoản thành công!");

      // Chờ một khoảng thời gian trước khi chuyển hướng
      setTimeout(() => {
        navigate("/login"); // Chuyển đến trang đăng nhập sau khi thông báo xong
      }, 2000); // 2000ms = 2 giây
    } catch (err) {
      toast.error(err.response?.data?.message || "Đăng ký thất bại");
      console.error("Registor failed:", err);
    }
  };

  return (
    <>
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
                  />
                </div>
                <div className="input-name">
                  <label>
                    Họ và tên<span style={{ color: "red" }}>*</span>
                  </label>
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
                  />
                </div>
              </div>

              <div className="col-md-6">
                <div className="input-phone">
                  <label>
                    Số điện thoại<span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="form-control"
                  />
                </div>
                <div className="input-cccd">
                  <label>
                    CCCD<span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={cccd}
                    onChange={(e) => setCccd(e.target.value)}
                    className="form-control"
                  />
                </div>
                <div className="input-address">
                  <label>
                    Địa chỉ<span style={{ color: "red" }}>*</span>
                  </label>
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
                        onChange={() => setGender(true)}
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
                        onChange={() => setGender(false)}
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
      <ToastContainer />
    </>
  );
};

export default Register;
