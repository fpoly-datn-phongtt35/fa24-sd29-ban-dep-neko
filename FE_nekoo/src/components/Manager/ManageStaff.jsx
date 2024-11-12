import { useEffect, useState } from "react";
import { fetchStaff, updateStaff } from "../../services/staffService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../css/ManageStaff.css"; // Thêm CSS nếu cần
import SidebarManager from "../../Layout/SidebarManager";
import useAuthorization from "../../hooks/useAuthorization";
import { Modal } from "react-bootstrap"; // Import Modal từ Bootstrap

const ManageStaff = () => {
  useAuthorization(["MANAGER"]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editDateOfBirth, setEditDateOfBirth] = useState("");
  const itemsPerPage = 5;

  // State để quản lý thông tin nhân viên cần cập nhật
  const [editStaff, setEditStaff] = useState(null);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editCCCD, setEditCCCD] = useState("");
  const [editAddress, setEditAddress] = useState("");

  // State cho modal thêm nhân viên
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newCCCD, setNewCCCD] = useState("");
  const [newGender, setNewGender] = useState(true);
  const [newAddress, setNewAddress] = useState("");
  const [newDateOfBirth, setNewDateOfBirth] = useState("");
  const [newRole] = useState("STAFF");

  // Định nghĩa loadStaff() bên ngoài useEffect
  const loadStaff = async () => {
    try {
      const token = localStorage.getItem("token");
      const staffList = await fetchStaff(token); // Gọi hàm từ service
      setStaff(staffList);
    } catch (err) {
      setError("Không thể tải danh sách nhân viên");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // useEffect để gọi loadStaff khi component mount
  useEffect(() => {
    loadStaff();
  }, []);

  // Cập nhật hàm handleAddUser
  const handleAddUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:8080/staff/create-account-staff",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            username: newUsername,
            password: newPassword,
            name: newName,
            phone: newPhone,
            cccd: newCCCD,
            gender: newGender,
            address: newAddress,
            role: newRole,
            dob: newDateOfBirth,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Thêm nhân viên không thành công");
      }

      await response.json();
      setShowAddModal(false);
      toast.success("Thêm nhân viên thành công!");

      // Gọi loadStaff để tải lại dữ liệu
      await loadStaff();

      // Reset form
      setNewUsername("");
      setNewPassword("");
      setNewName("");
      setNewPhone("");
      setNewCCCD("");
      setNewGender(true);
      setNewAddress("");
      setNewDateOfBirth("");
    } catch (err) {
      console.error(err);
      toast.error("Thêm nhân viên không thành công!");
    }
  };

  // Hàm mở form cập nhật
  const handleEditClick = (member) => {
    setEditStaff(member);
    setEditName(member.name || "");
    setEditPhone(member.phone || "");
    setEditCCCD(member.cccd || "");
    setEditAddress(member.address || "");
    setEditDateOfBirth(
      member.dateOfBirth
        ? new Date(member.dateOfBirth).toISOString().slice(0, 10)
        : ""
    );
  };

  // Hàm mở form thêm nhân viên
  const handleAddFormToggle = () => {
    setShowAddModal((prev) => !prev);
    setEditStaff(null); // Đảm bảo đóng form cập nhật nếu form thêm nhân viên đang mở
  };

  // update function
  const handleUpdate = async () => {
    if (!editStaff) return;

    try {
      const updatedMember = {
        id: editStaff.id,
        name: editName,
        phone: editPhone,
        cccd: editCCCD,
        dateOfBirth: new Date(editDateOfBirth).toISOString(),
        address: editAddress,
      };

      await updateStaff(updatedMember);

      setStaff((prev) =>
        prev.map((member) =>
          member.id === editStaff.id ? { ...member, ...updatedMember } : member
        )
      );

      setEditStaff(null);
      toast.success("Cập nhật thành công!");
    } catch (err) {
      console.error(err);
      setError("Cập nhật không thành công");
      toast.error("Cập nhật không thành công!");
    }
  };

  // dis_enable function
  const toggleStatus = async (member) => {
    try {
      const token = localStorage.getItem("token");
      const url = member.status
        ? `http://localhost:8080/staff/${member.id}/disable`
        : `http://localhost:8080/staff/${member.id}/enable`;

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Đổi trạng thái không thành công");
      }

      setStaff((prev) =>
        prev.map((staffMember) =>
          staffMember.id === member.id
            ? { ...staffMember, status: !staffMember.status }
            : staffMember
        )
      );

      toast.success(
        `Đã ${member.status ? "vô hiệu hóa" : "kích hoạt"} thành công!`
      );
    } catch (err) {
      console.error(err);
      toast.error("Đổi trạng thái không thành công!");
    }
  };

  if (loading) {
    return <p>Đang tải dữ liệu...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  const filteredStaff = staff.filter((member) =>
    member.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredStaff.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredStaff.length / itemsPerPage);

  return (
    <>
      <div className="row">
        <div className="col-md-2">
          <SidebarManager />
        </div>

        <div className="col-md-10">
          <div className="container">
            <h2>Danh Sách Nhân Viên</h2>

            <div className="top-controls">
              <button onClick={handleAddFormToggle} className="btn btn-primary">
                Thêm nhân viên
              </button>
              <input
                type="text"
                placeholder="Tìm kiếm nhân viên... (Tên đăng nhập)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input form-control"
              />
            </div>

            <table className="staff-table table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tên Đăng Nhập</th>
                  <th>Tên</th>
                  <th>Ngày Sinh</th>
                  <th>Điện Thoại</th>
                  <th>CCCD</th>
                  <th>Giới Tính</th>
                  <th>Trạng Thái</th>
                  <th>Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map((member) => (
                    <tr key={member.id}>
                      <td>{member.id || "N/A"}</td>
                      <td>{member.username || "N/A"}</td>
                      <td>{member.name || "N/A"}</td>
                      <td>
                        {member.dateOfBirth
                          ? new Date(member.dateOfBirth).toLocaleDateString(
                              "vi-VN",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              }
                            )
                          : "N/A"}
                      </td>
                      <td>{member.phone || "N/A"}</td>
                      <td>{member.cccd || "N/A"}</td>
                      <td>{member.gender ? "Nam" : "Nữ"}</td>
                      <td>
                        {member.status ? (
                          <span className="badge bg-success">
                            Đang làm việc
                          </span>
                        ) : (
                          <span className="badge bg-danger">Đã nghỉ việc</span>
                        )}
                      </td>
                      <td className="d-flex justify-content-around">
                        <button
                          onClick={() => handleEditClick(member)}
                          className="btn btn-warning"
                        >
                          Cập nhật
                        </button>
                        <button
                          onClick={() => toggleStatus(member)}
                          className={`btn ${
                            member.status ? "btn-danger" : "btn-success"
                          }`}
                        >
                          {member.status ? "Vô hiệu hóa" : "Kích hoạt"}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8">Không có nhân viên nào nào!</td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="pagination">
              <button
                className="btn btn-secondary"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              >
                Trước
              </button>
              <span>
                Trang {currentPage} / {totalPages}
              </span>
              <button
                className="btn btn-secondary"
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
              >
                Sau
              </button>
            </div>
          </div>

          {/* Modal thêm nhân viên */}
          <Modal show={showAddModal} onHide={handleAddFormToggle}>
            <Modal.Header closeButton>
              <Modal.Title>Thêm Nhân Viên</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {/* Form nhập thông tin nhân viên mới */}
              <div className="form-group">
                <label>
                  Tên Đăng Nhập<span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>
                  Mật khẩu<span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="password"
                  className="form-control"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Tên</label>
                <input
                  type="text"
                  className="form-control"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>
                  Ngày sinh<span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="date"
                  className="form-control"
                  value={newDateOfBirth}
                  onChange={(e) => setNewDateOfBirth(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Điện thoại</label>
                <input
                  type="text"
                  className="form-control"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>CCCD</label>
                <input
                  type="text"
                  className="form-control"
                  value={newCCCD}
                  onChange={(e) => setNewCCCD(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Giới tính</label>
                <div className="d-flex justify-content-around">
                  <label>
                    <input
                      style={{ marginRight: "5px" }}
                      type="radio"
                      name="gender"
                      value={true}
                      checked={newGender === true}
                      onChange={() => setNewGender(true)}
                    />{" "}
                    Nam
                  </label>
                  <label>
                    <input
                      style={{ marginRight: "5px" }}
                      type="radio"
                      name="gender"
                      value={false}
                      checked={newGender === false}
                      onChange={() => setNewGender(false)}
                    />{" "}
                    Nữ
                  </label>
                </div>
              </div>
              <div className="form-group">
                <label>Địa chỉ</label>
                <input
                  type="text"
                  className="form-control"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                />
              </div>
            </Modal.Body>
            <Modal.Footer>
              <button onClick={handleAddUser} className="btn btn-primary">
                Thêm Nhân Viên
              </button>
              <button
                onClick={handleAddFormToggle}
                className="btn btn-secondary"
              >
                Hủy
              </button>
            </Modal.Footer>
          </Modal>

          {/* Modal cập nhật nhân viên */}
          <Modal show={editStaff !== null} onHide={() => setEditStaff(null)}>
            <Modal.Header closeButton>
              <Modal.Title>Cập nhật thông tin nhân viên</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {/* Form nhập thông tin nhân viên cần cập nhật */}
              <div className="form-group">
                <label>Tên</label>
                <input
                  type="text"
                  className="form-control"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Ngày Sinh</label>
                <input
                  type="date"
                  className="form-control"
                  value={newDateOfBirth}
                  onChange={(e) => setNewDateOfBirth(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Điện thoại</label>
                <input
                  type="text"
                  className="form-control"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>CCCD</label>
                <input
                  type="text"
                  className="form-control"
                  value={editCCCD}
                  onChange={(e) => setEditCCCD(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Ngày Sinh</label>
                <input
                  type="date"
                  className="form-control"
                  value={editDateOfBirth}
                  onChange={(e) => setEditDateOfBirth(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Địa chỉ</label>
                <input
                  type="text"
                  className="form-control"
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                />
              </div>
            </Modal.Body>
            <Modal.Footer>
              <button onClick={handleUpdate} className="btn btn-primary">
                Cập nhật
              </button>
              <button
                onClick={() => setEditStaff(null)}
                className="btn btn-secondary"
              >
                Hủy
              </button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>

      {/* Thông báo toast */}
      <ToastContainer />
    </>
  );
};

export default ManageStaff;
