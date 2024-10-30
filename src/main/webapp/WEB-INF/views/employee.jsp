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
    <title>Employee</title>
</head>
<body>
<form method="get" action="/employee/search">
    <h2>Search</h2>
    <input type="text" name="keyword" placeholder="Tìm kiếm..." value="${keyword}">
    <button type="submit">Tìm kiếm</button>
</form>
<form action="/employee/filter" method="get">
    <h2>Filter</h2>
    <label for="minSalary">Min Salary:</label>
    <input type="number" id="minSalary" name="minSalary" step="0.01">

    <label for="maxSalary">Max Salary:</label>
    <input type="number" id="maxSalary" name="maxSalary" step="0.01">

    <button type="submit">Filter</button>
</form>
<form:form action="/employee/add" method="post" modelAttribute="p">
    <h2>THÔNG TIN NHÂN VIÊN</h2>
    <p> Name: <form:input path="name"/>
    </p>
    <p> Phone Number: <form:input path="phone_number"/>
    </p>
    <p> Gender: <form:input path="gender"/>
    </p>
    <p> Address: <form:input path="address"/>
    </p>
    <p> Email: <form:input path="email"/>
    </p>
    <p> Salary: <form:input path="salary"/>
    </p>
    <p> Date of Birth: <form:input path="date_of_birth"/>
    </p>
    <p> Hire Date: <form:input path="hire_date"/>
    </p>
    <p> Status
        <form:radiobutton path="status" value="1" /> Đang làm
        <form:radiobutton path="status" value="2" /> Đã nghĩ
    </p>
    <p> Role:
        <form:select path="rl">
            <form:options items="${listRole}" itemLabel="name" itemValue="id" />
        </form:select>
    </p>
    <button>Add</button>
</form:form>
<table border="1">
    <h1>DANH SÁCH NHÂN VIÊN</h1>
    <tr>
        <th>Id</th>
        <th>Name</th>
        <th>Phone Number</th>
        <th>Gender</th>
        <th>Address</th>
        <th>Email</th>
        <th>Salary</th>
        <th>Date of Birth</th>
        <th>Hire Date</th>
        <th>Status</th>
        <th>Role</th>
        <th>Action</th>
    </tr>
    <c:forEach items="${page.content}" var="p">
        <tr>
            <td>${p.id}</td>
            <td>${p.name}</td>
            <td>${p.phone_number}</td>
            <td>${p.gender}</td>
            <td>${p.address}</td>
            <td>${p.email}</td>
            <td>${p.salary}</td>
            <td>${p.date_of_birth}</td>
            <td>${p.hire_date}</td>
            <td>${p.status == 1?"Đang làm":"Đã nghĩ"}</td>
            <td>${p.rl.name}</td>
            <td>
                <a href="/employee/delete/${p.id}"><button>Xóa</button></a>
                <a href="/employee/detail/${p.id}"><button>Detail</button></a>
                <a href="/employee/view-update/${p.id}"><button>Update</button></a>
            </td>
        </tr>
    </c:forEach>
</table>

<c:forEach begin="0" end="${page.totalPages-1}" var="p">
    <a href="/employee/hien-thi?p=${p}">${p+1}</a>
</c:forEach>
</body>
</html>