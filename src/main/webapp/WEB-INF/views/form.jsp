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
<h1>Cập nhật thông tin khách hàng</h1>

<div class="container">
    <form action="/dep/update/${customer.id}" method="post">
        <div class="row">
            <div class="col-12">
                <label class="form-label"><strong>Họ tên:</strong></label>
                <input type="text" class="form-control" name="name" value="${customer.name}" required>
            </div>
            <div class="col-12">
                <label class="form-label"><strong>Email:</strong></label>
                <input type="email" class="form-control" name="email" value="${customer.email}" required>
            </div>
            <div class="col-12">
                <label class="form-label"><strong>Số điện thoại:</strong></label>
                <input type="text" class="form-control" name="phone_number" value="${customer.phone_number}" required>
            </div>
            <%--            <div class="col-12">--%>
            <%--                <label class="form-label"><strong>Giới tính:</strong></label>--%>
            <%--                <select class="form-select" name="gender" required>--%>
            <%--                    <option value="Nam" ${customer.gender == 'Nam' ? 'selected' : ''}>Nam</option>--%>
            <%--                    <option value="Nữ" ${customer.gender == 'Nữ' ? 'selected' : ''}>Nữ</option>--%>
            <%--                </select>--%>
            <%--            </div>--%>
            <div class="col-12">
                <label class="form-label"><strong>Giới tính:</strong></label>
                <div>
                    <input type="radio" id="genderMale" name="gender" value="Nam"
                    ${customer.gender == 'Nam' ? 'checked' : ''} required>
                    <label for="genderMale">Nam</label>

                    <input type="radio" id="genderFemale" name="gender" value="Nữ"
                    ${customer.gender == 'Nữ' ? 'checked' : ''} required>
                    <label for="genderFemale">Nữ</label>
                </div>
            </div>
            <div class="col-12">
                <label class="form-label"><strong>Địa chỉ:</strong></label>
                <input type="text" class="form-control" name="address" value="${customer.address}" required>
            </div>
            <div class="col-12">
                <label class="form-label"><strong>Thành phố:</strong></label>
                <input type="text" class="form-control" name="city" value="${customer.city}" required>
            </div>
            <div class="col-12">
                <label class="form-label"><strong>Quốc gia:</strong></label>
                <input type="text" class="form-control" name="country" value="${customer.country}" required>
            </div>
        </div>
        <div class="text-center mt-3">
            <button type="submit" class="btn btn-primary">Cập nhật</button>
        </div>
    </form>
    <a href="/dep/hien-thi" class="btn btn-secondary mt-3">Quay lại</a>
</div>

</body>
</html>