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
    <title>Voucher</title>
</head>
<body>
<label>Tìm kiếm: <input id="search-input" /></label>

<form:form action="/v1/voucher" method="post" modelAttribute="voucher">
    <p> Giá trị: <input name="discount"/>
    </p>
    <p> Số tiền cần: <label>
        <input  name="minPurchaseAmount" />
    </label>
    </p>
    <p> Số lượng mã gảm giá: <label>
        <input  name="usageLimit" />
    </label>
    </p>
    <p> Số lần khách hàng có thể dùng: <label>
        <input  name="userLimit" />
    </label>
    </p>
    <p>  <label> Ngày áp dụng:
        <input type="datetime-local" name="startDate"/>
    </label>
    </p>
    <p> Ngày kết thúc: <label>
        <input type="datetime-local" name="endDate"/>
    </label>
    </p>
    <p> Trạng thái
        <input type="radio" checked name="isActive" value="1" /> Hoạt động
        <input type="radio" name="isActive" value="0" /> Tắt
    </p>
    <p>
        <input type="radio" name="type" value="percentage" /> Giảm theo %
        <input type="radio" name="type" value="fixed-amount" /> Giảm theo số tiền
    </p>
    <p> Mô tả: <label>
        <textarea  name="description"></textarea>
    </label>
    </p>
    <button type="submit">Thêm</button>
</form:form>

<table>
    <tr>
        <th></th>
        <th>ID</th>
        <th>Giảm</th>
        <th>Số tiền cần để dùng</th>
        <th>Ngày áp dụng</th>
        <th>Ngày kết thúc</th>
        <th>Trạng thái</th>
        <th>Mô tả</th>
    </tr>
    <c:forEach items="${data.content}" var="item">
        <tr>
            <td><input type="checkbox" id=`${item.id}` /></td>
            <td>${item.id}</td>
            <td>${item.discount}${item.type == "percentage"? "%" : " VNĐ"}</td>
            <td>${item.minPurchaseAmount} VNĐ</td>
            <td>${item.startDate}</td>
            <td>${item.endDate}</td>
            <td>${item.isActive? "Hoạt động" : "Tắt"}</td>
            <td>${item.description}</td>
            <td><button>Sửa</button></td>
        </tr>
    </c:forEach>
</table>

<script>
    const search_input = document.getElementById("search-input");
    let searchTimeOut = null;
    const inputHandler = (e) => {
        console.log(searchTimeOut)
        if(searchTimeOut){
            clearTimeout(searchTimeOut)
        }
        searchTimeOut = setTimeout(() => {
            window.location=`http://localhost:8080/v1/voucher/search?keywork=`+e.target.value;
        }, 2000)
    }
    search_input.addEventListener('input', inputHandler);
</script>
</body>
</html>