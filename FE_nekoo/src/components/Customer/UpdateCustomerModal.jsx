import { useState } from "react";
import { updateCustomer } from "../../services/customerService"; // Import your update service function

const UpdateCustomerModal = ({ customer, onClose, onUpdate }) => {
  // Format the dateOfBirth to 'YYYY-MM-DD' for the form if it's in Instant format
  const formattedDateOfBirth = customer.dateOfBirth
    ? new Date(customer.dateOfBirth).toISOString().slice(0, 10)
    : "";

  const [formData, setFormData] = useState({
    name: customer.name || "",
    dateOfBirth: formattedDateOfBirth, // Set formatted dateOfBirth for the form
    phone: customer.phone || "",
    cccd: customer.cccd || "",
    address: customer.address || "",
    gender: customer.gender,
  });
  const [formDataU, setFormDataa] = useState({
    name: customer.name || "",
    dateOfBirth: customer.dateOfBirth, // Set formatted dateOfBirth for the form
    phone: customer.phone || "",
    cccd: customer.cccd || "",
    address: customer.address || "",
    gender: customer.gender,
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const newValue = type === "checkbox" ? e.target.checked : value;
    setFormData({ ...formData, [name]: newValue });
    setFormDataa({ ...formDataU, [name]: newValue });
  };

  const handleSubmit = async () => {
    try {
      // Send the dateOfBirth in 'YYYY-MM-DD' format
      await updateCustomer(customer.ud_id, formDataU);
      onUpdate(); // Callback to refresh data in parent component
      onClose(); // Close modal
    } catch (error) {
      console.error("Error updating customer:", error);
    }
  };

  return (
    <div className="modal show d-block" tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Cập nhật thông tin khách hàng</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body" style={{ marginTop: "4em" }}>
            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Họ và tên</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Ngày sinh</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Số điện thoại</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">CCCD</label>
                  <input
                    type="text"
                    name="cccd"
                    value={formData.cccd}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Địa chỉ</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Giới tính</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value={true}>Nam</option>
                    <option value={false}>Nữ</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Đóng
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSubmit}
            >
              Cập nhật
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateCustomerModal;
