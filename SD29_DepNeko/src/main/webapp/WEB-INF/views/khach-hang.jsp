<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>


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
<h1>Quản lý khách hàng</h1>





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

<form method="get" action="/dep/search">
    <h2>Search</h2>
    <input type="text" name="keyword" placeholder="Tìm kiếm..." value="${keyword}">
    <button type="submit">Tìm kiếm</button>
</form>

<hr>

<table class="table table-hover">
    <tr>
        <th>STT</th>
        <th>Họ và tên</th>
        <th>Số điện thoại</th>
        <th>Email</th>
        <th>Giới tính</th>
        <th>Địa chỉ</th>
        <th>Thành phố</th>
        <th>Quốc gia</th>
        <th>Hành động</th>
    </tr>
    <c:forEach items="${page.content}" var="kh" varStatus="i">
        <tr>
            <td>${i.index + 1}</td>
            <td>${kh.name}</td>
            <td>${kh.phone_number}</td>
            <td>${kh.email}</td>
            <td>${kh.gender == 'Nam' ? 'Nam' : 'Nữ'}</td>
            <td>${kh.address}</td>
            <td>${kh.city}</td>
            <td>${kh.country}</td>
            <td>
                <a href="/dep/detail/${kh.id}" class="btn btn-warning">Detail</a>
                <a onclick="return confirm('Are you sure you want to delete this item?');" href="/dep/delete/${kh.id}" class="btn btn-danger">Xóa</a>
            </td>
        </tr>
    </c:forEach>
</table>
<c:forEach begin="0" end="${page.totalPages-1}" var="p">
    <a href="/khach-hang/hien-thi?p=${p}">${p+1}</a>
</c:forEach>
</body>
</html>
