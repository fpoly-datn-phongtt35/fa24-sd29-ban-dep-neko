import { useEffect, useState } from "react";
//import { fetchStaff, updateStaff } from "../../services/staffService"; // Import hàm từ service
import { fetchCustomer } from "../../services/customerService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SidebarStaff from "../../Layout/SidebarStaff";
import "../../css/ManageCustomer.css"; // Thêm CSS nếu cần

const ManageCustomer = () => {
  const [customer, setCustomer] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const loadCustomer = async () => {
      try {
        const token = localStorage.getItem("token");
        const customerList = await fetchCustomer(token); // Gọi hàm từ service
        setCustomer(customerList);
      } catch (err) {
        setError("Không thể tải danh sách khách hàng");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadCustomer();
  }, []);

  //button edit
  const handleEditClick = (member) => {
    setEditCustomer(member);
    setEditName(member.name || "");
    setEditPhone(member.phone || "");
    setEditCCCD(member.cccd || "");
    setEditDateOfBirth(
      member.dateOfBirth
        ? new Date(member.dateOfBirth).toISOString().slice(0, 10)
        : ""
    ); // Format the date to YYYY-MM-DD for input type="date"
  };

  //dis_enable function
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

      setCustomer((prev) =>
        prev.map((customerMember) =>
          customerMember.id === member.id
            ? { ...customerMember, status: !customerMember.status }
            : customerMember
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

  const filteredCustomer = customer.filter((member) =>
    member.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCustomer.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredCustomer.length / itemsPerPage);

  return (
    <>
      <div className="row">
        <div className="col-2">
          <SidebarStaff />
        </div>

        <div className="col-10">
          <div className="container">
            <h2>Danh Sách khách hàng</h2>

            <input
              type="text"
              placeholder="Tìm kiếm khách hàng... (Tên đăng nhập)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-control mb-3" // Bootstrap class for styling input
            />

            <table className="customer-table table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tên Đăng Nhập</th>
                  <th>Tên</th>
                  <th>Ngày Sinh</th>
                  <th>Số Điện Thoại</th>
                  <th>CCCD</th>
                  <th>Trạng Thái</th>
                  <th>Ngày Tạo</th>
                  <th>Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map((member) => (
                    <tr key={member.id}>
                      <td>{member.id}</td>
                      <td>{member.username}</td>
                      <td>{member.name || "N/A"}</td>
                      <td>
                        {member.dateOfBirth
                          ? new Date(member.dateOfBirth).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td>{member.phone || "N/A"}</td>
                      <td>{member.cccd || "N/A"}</td>
                      <td>{member.status ? "Hoạt động" : "Ngừng hoạt động"}</td>
                      <td>{new Date(member.createAt).toLocaleString()}</td>
                      <td>
                        <button
                          className="btn btn-danger"
                          onClick={() => toggleStatus(member)}
                        >
                          {member.status ? "Vô hiệu hóa" : "Kích hoạt"}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9">Không có khách hàng nào!</td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="pagination">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Trang trước
              </button>
              <span>{`Trang ${currentPage} trong tổng ${totalPages} trang `}</span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                Trang sau
              </button>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer />
    </>
  );
};

export default ManageCustomer;
