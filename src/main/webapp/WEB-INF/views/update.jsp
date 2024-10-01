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
    <title>Document</title>
</head>
<body>
<form:form action="/employee/update/${p.id}" method="post" modelAttribute="p">

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
    <button>Update</button>
</form:form>


</body>
</html>