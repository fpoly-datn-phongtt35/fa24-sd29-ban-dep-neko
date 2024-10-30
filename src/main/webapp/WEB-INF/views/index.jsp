<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>

<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Customer</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet"
          integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
</head>
<body>
<h1>Đăng kí thành viên</h1>


<form action="/dep/add" method="post">
    <div class="container">
        <div class="row">
            <div class="col">
                <h2>THÔNG TIN CÁ NHÂN</h2>
                <div class="row g-3">
                    <div class="col-10">
                        <label class="form-label">Họ tên</label>
                        <input type="text" class="form-control" name="name" required>
                    </div>
                    <div class="col-10">
                        <label class="form-label">Email</label>
                        <input type="email" class="form-control" name="email" required>
                    </div>
                    <div class="col-10">
                        <label class="form-label">Số điện thoại</label>
                        <input type="text" class="form-control" name="phone_number" required>
                    </div>
                    <div class="col-10">
                        <label class="form-label">Địa chỉ</label>
                        <input type="text" class="form-control" name="address" required>
                    </div>
                    <div class="col-10">
                        <label class="form-label">Thành phố</label>
                        <input type="text" class="form-control" name="city" required>
                    </div>
                    <div class="col-10">
                        <label class="form-label">Quốc gia</label>
                        <input type="text" class="form-control" name="country" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Giới tính</label>
                        <div>
                            <input class="form-check-input" type="radio" value="Nam" name="gender"
                                   <c:if test="${kh.gender == 'Nam'}">checked</c:if>>
                            <label class="form-check-label">Nam</label>

                            <input class="form-check-input" type="radio" value="Nữ" name="gender"
                                   <c:if test="${kh.gender == 'Nữ'}">checked</c:if>>
                            <label class="form-check-label">Nữ</label>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col">
                <h2>THÔNG TIN ĐĂNG NHẬP</h2>
                <div class="row g-3">
                    <div class="col-10">
                        <label class="form-label">Tài khoản</label>
                        <input type="text" class="form-control" name="username" required>
                    </div>
                    <div class="col-10">
                        <label class="form-label">Mật khẩu</label>
                        <input type="password" class="form-control" name="password" required>
                    </div>
                    <div class="col-10">
                        <label class="form-label">Nhập lại mật khẩu</label>
                        <input type="password" class="form-control" name="confirm_password" required>
                    </div>
                </div>
            </div>
        </div>
        <div class="text-center">
            <button type="submit" class="btn btn-primary">Xác nhận</button>
        </div>
    </div>
</form>
<%--<form:form action="" method="post" modelAttribute="p">--%>

<%--    <p> Tên: <form:input path="tenPhong"/>--%>
<%--    </p>--%>
<%--    <p> Ghi chú: <form:input path="ghiChu"/>--%>
<%--    </p>--%>
<%--    <p> Số lượng phòng: <form:input path="soLuongPhong"/>--%>
<%--    </p>--%>
<%--    <p> Trạng thái--%>
<%--        <form:radiobutton path="trangThai" value="1" /> Còn Phòng--%>
<%--        <form:radiobutton path="trangThai" value="2" /> Hết Phòng--%>
<%--    </p>--%>
<%--    <p> Loại phòng:--%>
<%--        <form:select path="loaiPhong">--%>
<%--            <form:options items="${dsLoaiPhong}" itemLabel="tenLoaiPhong" itemValue="id" />--%>
<%--        </form:select>--%>
<%--    </p>--%>

<%--    <button class="btn btn-primary">Thêm</button>--%>
<%--</form:form>--%>
<%--<table class="table table-bordered">--%>
<%--    <tr>--%>
<%--        <th>Full Name</th>--%>
<%--        <th>Gender</th>--%>
<%--        <th>Address</th>--%>
<%--        <th>Email</th>--%>
<%--        <th>Phone</th>--%>
<%--        <th>Actions</th>--%>
<%--    </tr>--%>
<%--    <c:forEach items="${page.content}" var="p">--%>
<%--        <tr>--%>
<%--            <td>${p.id}</td>--%>
<%--            <td>${p.tenPhong}</td>--%>
<%--            <td>${p.ghiChu}</td>--%>
<%--            <td>${p.soLuongPhong}</td>--%>
<%--            <td>${p.trangThai == 1?"Còn Phòng":"Hết Phòng"}</td>--%>
<%--            <td>${p.loaiPhong.tenLoaiPhong}</td>--%>
<%--            <td>--%>
<%--                <a href="/dich-vu/delete/${p.id} "><button class="btn btn-warning">Xóa</button></a>--%>
<%--                <a href="/dich-vu/detail/${p.id}"><button CLASS="btn btn-success">Detail</button></a>--%>
<%--                <a href="/dich-vu/view-update/${p.id}"><button class="btn btn-danger">Update</button></a>--%>
<%--            </td>--%>
<%--        </tr>--%>
<%--    </c:forEach>--%>
<%--</table>--%>

<%--<c:forEach begin="0" end="${page.totalPages-1}" var="p">--%>
<%--    <a href="/dich-vu/hien-thi?p=${p}">${p+1}</a>--%>
<%--</c:forEach>--%>
</body>
</html>
