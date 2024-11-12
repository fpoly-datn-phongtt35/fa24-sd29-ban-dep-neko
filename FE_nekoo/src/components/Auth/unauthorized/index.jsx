import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../../css/Unauthorized.css";

const NotFoundPage = () => {
  const navigate = useNavigate();
  const [counter, setCounter] = useState(15);

  const handleButtonClick = () => {
    const roleName = localStorage.getItem("roleName");

    switch (roleName) {
      case "MANAGER":
        navigate("/manageStaff");
        break;
      case "STAFF":
        navigate("/manageCustomer");
        break;
      case "CUSTOMER":
        navigate("/home");
        break;
      default:
        alert("Bạn không có quyền truy cập vào trang này!");
        break;
    }
  };

  useEffect(() => {
    const countdown = setInterval(() => {
      setCounter((prevCounter) => prevCounter - 1);
    }, 1000);

    const timer = setTimeout(() => {
      handleButtonClick();
    }, 15000);

    return () => {
      clearInterval(countdown);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="not-found-body">
      <main>
        <div className="not-found-container">
          <section className="not-found-section min-vh-100 d-flex flex-column align-items-center justify-content-center">
            <h1 className="not-found-title">403</h1>
            <h2 className="not-found-message">
              Bạn không có quyền truy cập vào đường dẫn này!
            </h2>
            <button
              onClick={handleButtonClick}
              className="not-found-button mt-3"
            >
              Quay trở lại ({counter})
            </button>
          </section>
        </div>
      </main>
    </div>
  );
};

export default NotFoundPage;
