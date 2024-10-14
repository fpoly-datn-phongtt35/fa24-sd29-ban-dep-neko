<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %> 
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %> 
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"
    />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Voucher</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-select/1.14.0-beta2/css/bootstrap-select.min.css" integrity="sha512-mR/b5Y7FRsKqrYZou7uysnOdCIJib/7r5QeJMFvLNHNhtye3xJp1TdJVPLtetkukFn227nKpXD9OjUc09lx97Q==" crossorigin="anonymous"
  referrerpolicy="no-referrer" />
  <style>
    .container-fluid {
    display: flex;
    flex-direction: column; /* Sắp xếp theo cột */
    min-height: 100vh; /* Đảm bảo chiếm toàn bộ chiều cao */
    }

    .content {
        flex: 1; /* Nội dung chính sẽ chiếm không gian còn lại */
    }
    .toast-container {
        position: fixed; /* Đặt toast ở vị trí cố định */
        bottom: 20px; /* Khoảng cách từ đáy */
        right: 20px; /* Khoảng cách từ bên phải */
        z-index: 1050; /* Đặt z-index cho toast để đảm bảo nó nằm trên các phần tử khác */
    }

    .bootstrap-select:not([class*=col-]):not([class*=form-control]):not(.input-group-btn) {
      width: 100%;
      border: 1px solid rgb(212, 207, 207);
      border-radius: 5px;
      background-color: #ffff;
    }
    #pagination-container {
      display: flex; /* Thiết lập container thành flexbox */
      align-items: center; /* Căn giữa các phần tử theo chiều dọc */
    }
    .select-pageSize {
      padding: 8px;
      margin-left: auto;
      cursor: pointer;
      margin-right: 15px;
    }
    .pagination-custom {
            margin-top: 8px;
            display: flex;
            list-style: none;
            justify-content: center;
            padding-left: 0;
        }
        .pagination-custom li {
            margin: 0 5px;
        }
        .pagination-custom a {
            text-decoration: none;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
            color: #007bff;
        }
        .pagination-custom .active a {
            background-color: #007bff;
            color: white;
        }
        .pagination-custom .disabled a {
            pointer-events: none;
            color: #ddd;
        }
  </style>
  </head>
  <body>
    <div class="container-fluid">
      <div class="content">
        <!-- Tìm kiếm và lọc -->
        <div class="card" style="margin-top: 12px;">
          <div class="card-body row">
            <div class="col-4" style="display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <label>Tìm kiếm</label>
                <input class="form-control" type="search" placeholder="Nhập giảm giá hoặc tên khách hàng" id="search-input" aria-label="Search">
              </div>
              <button style="max-width: 150px; font-size: .9rem; display: none;" type="button" class="btn btn-danger" id="btn-delete" data-bs-toggle="modal" data-bs-target="#modal-isActive">Đổi trạng thái</button>
            </div>
            <div class="col-8">
                <div class="row">
                    <div class="col-4">
                      <label>Trạng thái</label>
                      <select class="form-select" id="select-fill-isActive" aria-label="Default select example">
                        <option selected value="">Tất cả</option>
                        <option value="1">Hoạt động</option>
                        <option value="0">Không hoạt động</option>
                      </select>
                    </div>
                    <div class="col-4">
                      <label>Loại</label>
                      <select class="form-select" id="select-fill-type" aria-label="Default select example">
                        <option selected value="">Tất cả</option>
                        <option value="percentage">Giảm theo %</option>
                        <option value="fixed-amount">Giảm theo số tiền</option>
                      </select>
                    </div>
                    <div class="col-4">
                      <label>Brand</label>
                      <select class="form-select" id="select-fill-brand" aria-label="Default select example">
                        <option selected value="">Tất cả</option>
                        <c:forEach items="${brands}" var="item">
                          <option value="${item.id}">${item.name}</option>
                        </c:forEach>
                      </select>
                    </div>
                    <div class="col-5" style="margin-top: 20px;">
                      <label>Giảm giá trong khoảng</label>
                      <div class="row">
                        <div class="col-6">
                          <div class="col-12">
                            <label for="minAmount" class="form-label">Tối thiểu</label>
                            <input type="number" class="form-control" id="minDiscount" placeholder="" min="0">
                          </div>
                        </div>
                        <div class="col-6">
                          <div class="col-12">
                            <label for="minAmount" class="form-label">Tối đa</label>
                            <input type="number" class="form-control" id="maxDiscount" placeholder="" min="0">
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="col-5" style="margin-top: 20px;">
                      <label>Số tiền tối thiểu cần trong khoảng</label>
                      <div class="row">
                        <div class="col-6">
                          <div class="col-12">
                            <label for="minAmount" class="form-label">Tối thiểu</label>
                            <input type="number" class="form-control" id="minPurchaseAmount" placeholder="" min="0">
                          </div>
                        </div>
                        <div class="col-6">
                          <div class="col-12">
                            <label for="minAmount" class="form-label">Tối đa</label>
                            <input type="number" class="form-control" id="maxPurchaseAmount" placeholder="" min="0">
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="col-2" style="display: flex; align-items: end; justify-content: end; flex-direction: column;">
                      <button  onclick="fillter()" style="margin-bottom: 10px; min-width: 90px;" type="button" class="btn btn-success">Lọc</button>
                      <button onclick="reset()" style="min-width: 90px;" type="button" class="btn btn-success">Làm mới</button>
                    </div>
                </div>
            </div>
          </div>
        </div>
       
        
    <!-- Modal -->
      <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">Thêm mã giảm giá</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <form class="row g-3 needs-validation" id="form-create" action="/v1/voucher/create" method="post" modelAttribute="voucher">
                <div class="col-md-6">
                  <label for="discount" class="form-label">Giảm giá<span style="color: red;"> *</span></label>
                  <input type="number" name="discount" class="form-control" id="discount">
                  <div class="invalid-feedback">
                    Vui lòng điền số giảm giá (giảm giá > 0)
                  </div>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Số tiền tối thiểu<span style="color: red;"> *</span></label>
                  <input type="number" class="form-control" name="minPurchaseAmount" id="create-minPurchaseAmount">
                  <div class="invalid-feedback">
                    Vui lòng điền số tiền tối thiểu (lớn hơn hoặc bằng 0)
                  </div>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Số lượng</label>
                  <input type="number" class="form-control" name="usageLimit" id="usageLimit" min="1">
                  <div class="invalid-feedback">
                    Số lượng không được nhỏ hơn 0
                  </div>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Số lần dùng</label>
                  <input type="number" class="form-control" name="userLimit" id="userLimit" min="1">
                  <div class="invalid-feedback">
                    Số lần dùng phải lớn hơn 0
                  </div>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Ngày áp dụng<span style="color: red;"> *</span></label>
                  <input type="datetime-local" class="form-control" name="startDate" id="startDate">
                  <div class="invalid-feedback">
                    Vui lòng chọn ngày áp dụng mã
                  </div>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Ngày kết thúc<span style="color: red;"> *</span></label>
                  <input type="datetime-local" class="form-control" name="endDate" id="endDate">
                  <div class="invalid-feedback">
                    Vui lòng chọn ngày kết thúc mã
                  </div>
                </div>
                <div class="col-md-6">
                  <div style="margin-top: 13px;">
                    <input type="radio" onchange="handleRadioType()" id="percentage" name="type" value="percentage" /> Giảm theo %
                  <input type="radio" onchange="handleRadioType()" name="type" checked value="fixed-amount" /> Giảm theo số tiền
                  </div>
                  <div style="margin: 13px 0">
                    <input type="radio" checked name="isActive" value="1" /> Hoạt động
                    <input type="radio" name="isActive" value="0" /> Không hoạt động
                  </div>
                </div>
                <div class="col-md-6 div-maxDiscount" style="display: none;">
                  <label class="form-label">Giảm tối đa</label>
                  <input type="number" class="form-control" name="maxDiscount" id="maxDiscount" min="1">
                  <div class="invalid-feedback">
                    Phải lớn hơn 0
                  </div>
                </div>
                <div class="col-md-12">
                  <label class="form-label">Chọn các brand áp dụng mã<span style="color: red;"> *</span></label>
                  <select class="selectpicker" id="brandIds" name="brandIds" multiple aria-label="size 3 select example">
                    <c:forEach items="${brands}" var="item">
                      <option value="${item.id}">${item.name}</option>
                    </c:forEach>
                  </select>
                  <div class="invalid-feedback valid-create-brand">
                    Vui lòng chọn brand để áp dụng mã giảm giá
                  </div>
                </div>
                <div class="col-12">
                  <label class="form-label">Mô tả</label>
                  <textarea type="text" class="form-control" id="description" name="description"></textarea>
                </div>
                <div class="col-12"></div>
                <button type="submit" style="max-width: 70px; margin-right: 10px; margin-left: auto;" class="btn btn-primary">Thêm</button>
                <button type="button" style="max-width: 70px; margin-right: 8px;" class="btn btn-secondary" data-bs-dismiss="modal">Huỷ</button>
              </form>
            </div>
          </div>
        </div>
      </div>
      
    
      <div class="modal fade needs-validation" id="modal-update" tabindex="-1" aria-labelledby="modalUpdate" aria-hidden="true">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="modalUpdate">Cập nhật mã giảm giá</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <form class="row g-3" id="form-update">
                <div class="col-md-6">
                  <label for="discount" class="form-label">Giảm giá<span style="color: red;"> *</span></label>
                  <input type="number" name="discount" class="form-control" id="update-discount">
                  <div class="invalid-feedback">
                    Vui lòng điền số giảm giá (giảm giá > 0)
                  </div>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Số tiền tối thiểu<span style="color: red;"> *</span></label>
                  <input type="number" class="form-control" name="minPurchaseAmount" id="update-minPurchaseAmount">
                  <div class="invalid-feedback">
                    Vui lòng điền số tiền tối thiểu (lớn hơn hoặc bằng 0)
                  </div>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Số lượng</label>
                  <input type="number" class="form-control" name="usageLimit" id="update-usageLimit" min="1">
                  <div class="invalid-feedback">
                    Số lượng không được nhỏ hơn 0
                  </div>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Số lần dùng</label>
                  <input type="number" class="form-control" name="userLimit" id="update-userLimit" min="1">
                  <div class="invalid-feedback">
                    Số lần dùng phải lớn hơn 0
                  </div>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Ngày áp dụng<span style="color: red;"> *</span></label>
                  <input type="datetime-local" class="form-control" name="startDate" id="update-startDate">
                  <div class="invalid-feedback">
                    Vui lòng chọn ngày bắt đầu mã
                  </div>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Ngày kết thúc<span style="color: red;"> *</span></label>
                  <input type="datetime-local" class="form-control" name="endDate" id="update-endDate">
                  <div class="invalid-feedback">
                    Vui lòng chọn ngày kết thúc mã
                  </div>
                </div>
                <div class="col-md-6">
                  <div style="margin-top: 13px;">
                    <input type="radio" onchange="handleRadioType()" id="update-percentage" name="update-type" value="percentage" /> Giảm theo %
                    <input type="radio" onchange="handleRadioType()" id="update-fixed-amount" name="update-type" value="fixed-amount" /> Giảm theo số tiền
                  </div>
                  <div style="margin: 13px 0">
                    <input type="radio" name="update-isActive"  value="1" /> Hoạt động
                    <input type="radio" name="update-isActive" value="0" /> Không hoạt động
                  </div>
                </div>
                <div class="col-md-6 div-maxDiscount" style="display: none;">
                  <label class="form-label">Giảm tối đa</label>
                  <input type="number" class="form-control" name="maxDiscount" id="update-maxDiscount" min="1">
                  <div class="invalid-feedback">
                    Phải lớn hơn 0
                  </div>
                </div>
                <div class="col-md-12">
                  <label class="form-label">Chọn các brand áp dụng mã<span style="color: red;"> *</span></label>
                  <select class="selectpicker" id="update-brand" multiple aria-label="size 3 select example">
                    <c:forEach items="${brands}" var="item">
                      <option value="${item.id}">${item.name}</option>
                    </c:forEach>
                  </select>
                </div>
                <div class="col-12">
                  <label class="form-label">Mô tả</label>
                  <textarea type="text" class="form-control" id="update-description" name="description"></textarea>
                </div>
                <div class="col-12"></div>
                <button type="button" id="btn-form-update" style="max-width: 100px; margin-right: 10px; margin-left: auto;" class="btn btn-primary">Cập nhật</button>
                <button type="button" style="max-width: 70px; margin-right: 8px;" class="btn btn-secondary" data-bs-dismiss="modal">Huỷ</button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <!-- Modal thay đổi trạng thái -->
      <div class="modal fade" id="modal-isActive" tabindex="-1" aria-labelledby="modal-active" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="modal-active">Thay đổi trạng thái mã giảm giá</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              Hãy chọn trạng thái cho mã giảm giá
            </div>
            <div class="modal-footer">
              <button type="button" onclick="updateIsActive(1)" class="btn btn-primary" data-bs-dismiss="modal">Hoạt động</button>
              <button type="button" onclick="updateIsActive(0)" class="btn btn-secondary" data-bs-dismiss="modal">Không hoạt động</button>
            </div>
          </div>
        </div>
      </div>
      <!-- Bảng hiển thị voucher -->
      <table class="table table-striped table-hover">
        <thead>
          <tr>
            <th scope="col"><input type="checkbox" id="selectAll"/></th>
            <th scope="col">Giảm giá</th>
            <th scope="col">Số tiền tối thiểu</th>
            <th scope="col">Số lượng</th>
            <th scope="col">Số lần dùng</th>
            <th scope="col">Ngày áp dụng</th>
            <th scope="col">Ngày kết thúc</th>
            <th scope="col">Trạng thái</th>
            <th scope="col">Mô tả</th>
            <th><button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal"
              style="padding: 1px 9px;">
              +
            </button></th>
          </tr>
        </thead>
        <tbody id="result">
          <c:forEach items="${data.content}" var="item">
            <tr>
              <td><input type="checkbox" onchange="handleCheckbox()" class="checkbox-item" id=${item.id} value=${item.id} /></td>
              <td>
                <fmt:formatNumber value="${item.discount}" type="currency" currencySymbol="${item.type == 'percentage'? '%' : 'đ'}" />
                <c:if test="${item.maxDiscount != null}">(Tối đa <fmt:formatNumber value="${item.maxDiscount}" type="currency" currencySymbol="" />)</c:if>
              </td>
              <td><fmt:formatNumber value="${item.minPurchaseAmount}" type="currency" currencySymbol="₫" /></td>
              <td>${item.usageLimit != null? item.usageLimit : "Không giới hạn"}</td>
              <td>${item.userLimit != null? item.userLimit : "Không giới hạn"}</td>
              <td>${item.startDate}</td>
              <td>${item.endDate}</td>
              <td>${item.isActive? "Hoạt động" : "Không hoạt động"}</td>
              <td><textarea 
                style="max-width: 300px; max-height: 100px; overflow-y: auto;
                border: 0px; background-color: rgba(0, 0, 0, 0.0);"
                >${item.description}</textarea></td>
              <td><button type="button" onclick="findVoucherById('${item.id}')" class="btn btn-warning">Sửa</button></td>
            </tr>
          </c:forEach>
        </tbody>
        <tr id="no-results" style="display: none">
          <td colspan="10" style="text-align: center">Không có kết quả nào.</td>
        </tr>
      </table>
      <div id="pagination-container">
        <select id="pageSizeSelect" class="select-pageSize" onchange="updatePageSize()">
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
    
        <ul id="paginationList" class="pagination-custom">
            <!-- Các nút phân trang sẽ được thêm vào đây -->
        </ul>
      </div>
      </div>

    <div class="toast-container top-0 end-0 p-3" style="z-index: 9999">
      <div id="liveToast" style="display: none;" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="toast-header">
          <strong class="me-auto">Thông báo</strong>
          <small></small>
          <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
          <p id="toast-message"></p>
        </div>
      </div>
    </div>

  </div>

  <script src="https://code.jquery.com/jquery-3.6.0.min.js" integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4=" crossorigin="anonymous"></script>
  <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js" integrity="sha384-IQsoLXl5PILFhosVNubq5LC7Qb9DXgDA9i+tQ8Zj3iwWAwPtgFTxbJ8NT4GN1R8p" crossorigin="anonymous"></script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.min.js" integrity="sha384-cVKIPhGWiC2Al4u+LWgxfKTRIcfu0JTxR+EQDz/bgldoEyl4H0zUF0QKbrJ0EcQF" crossorigin="anonymous"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-select/1.14.0-beta2/js/bootstrap-select.min.js" integrity="sha512-FHZVRMUW9FsXobt+ONiix6Z0tIkxvQfxtCSirkKc5Sb4TKHmqq1dZa8DphF0XqKb3ldLu/wgMa8mT6uXiLlRlw==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    <script type="text/javascript">
      const urlParams = new URLSearchParams(window.location.search);
      const select_fill_type = document.getElementById('select-fill-type');
      const select_fill_isActive = document.getElementById('select-fill-isActive');
      const select_fill_brand = document.getElementById('select-fill-brand');
      const input_minDiscount = document.getElementById('minDiscount');
      const input_maxDiscount = document.getElementById('maxDiscount');
      const input_minPurchaseAmount = document.getElementById('minPurchaseAmount');
      const input_maxPurchaseAmount = document.getElementById('maxPurchaseAmount');
      const toast_message = document.getElementById('toast-message');
      const modalUpdate = new bootstrap.Modal(document.getElementById('modal-update'));


      let page = urlParams.get('page'); // Lấy số trang hiện tại
      let size = urlParams.get('size');
      let type = null;
      let isActive = null;
      let selectBrand = null;
      let minAmount = null;
      let maxAmount = null;
      let minDiscount = null;
      let maxDiscount = null;
      let keywork = '';

      // Start Toast
      var myToast = document.getElementById('liveToast');
      var bootstrapToast = new bootstrap.Toast(myToast);

      // Hiển thị toast
      function showToast() {
          myToast.style.display = 'block'; // Hiển thị lại
          bootstrapToast.show();
      }

      // Sự kiện để ẩn hoàn toàn toast
      myToast.addEventListener('hidden.bs.toast', function () {
          myToast.style.display = 'none'; // Ẩn hoàn toàn khỏi DOM
      });
      // End Toast

      // Start validation form create
      function checkStartBeforeEnd(startDate, endDate) {
        startDate = new Date(startDate)
        endDate = new Date(endDate)
        // So sánh thời gian của hai ngày
        if (startDate.getTime() < endDate.getTime()) {
            return true; // Ngày bắt đầu trước ngày kết thúc
        } else if (startDate.getTime() === endDate.getTime()) {
            // Nếu cùng ngày, kiểm tra giờ
            const startHour = startDate.getHours();
            const endHour = endDate.getHours();
            
            // Kiểm tra giờ
            return startHour < endHour; 
        }
        return false; // Ngày bắt đầu không trước ngày kết thúc
      }

      // JavaScript để vô hiệu hóa việc submit form nếu có trường không hợp lệ
        (function () {
          'use strict';

          const formCreate = document.querySelector('#form-create');
          formCreate.addEventListener('submit', function (event) {
              event.preventDefault(); // Ngăn chặn hành động submit form
              event.stopPropagation(); // Ngăn sự kiện lan rộng ra ngoài
              const form = this;
              let isValid = true;
              const discount = document.getElementById('discount')
              if(discount.value <= 0 || discount.value == ''){
                discount.classList.add('is-invalid');
                isValid = false
              }else {
                discount.classList.remove('is-invalid');
                discount.classList.add('is-valid')
              }

              const minPurchaseAmount = document.getElementById('create-minPurchaseAmount')
              if(minPurchaseAmount.value < 0 || minPurchaseAmount.value == ''){
                minPurchaseAmount.classList.add('is-invalid');
                isValid = false
              }else {
                minPurchaseAmount.classList.remove('is-invalid');
                minPurchaseAmount.classList.add('is-valid')
              }

              const startDate = document.getElementById('startDate');
              const endDate = document.getElementById('endDate');
              // kiểm tra ngày bắt đầu
              if(startDate.value == ''){
                startDate.classList.add('is-invalid')
                isValid = false
              }else {
                startDate.classList.remove('is-invalid')
              }
              // kiểm tra ngày kết thúc
              if(endDate.value == ""){
                endDate.classList.add('is-invalid')
                isValid = false;
              }else {
                endDate.classList.remove('is-invalid')
              }
              // kiểm tra ngày bắt đầu có trước ngày kết thúc không
              if(startDate.value != '' && endDate.value != '' && !checkStartBeforeEnd(startDate.value, endDate.value)){
                toast_message.innerHTML = "Vui lòng chọn ngày bắt đầu trước ngày kết thúc"
                showToast()
                isValid = false;
                return;
              }

              // kiểm tra brand
              const brandIds = document.getElementById('brandIds')
              if (brandIds.selectedOptions.length <= 0) {
                toast_message.innerHTML = "Vui lòng chọn brand để áp dụng mã"
                showToast()
                isValid = false;
              } 
              // Nếu form hợp lệ, cho phép submit
              if (isValid && form.checkValidity()) {
                form.submit();
              }
          }, false);

          const formUpdate = document.querySelector('#form-update')
          document.getElementById('btn-form-update').addEventListener('click', function (event) {
              let isValid = true;
              // Kiểm tra thủ công từng input
              const discount = document.getElementById('update-discount')
              if(discount.value <= 0 || discount.value == ''){
                discount.classList.add('is-invalid');
                isValid = false
              }else {
                discount.classList.remove('is-invalid');
                discount.classList.add('is-valid')
              }

              const minPurchaseAmount = document.getElementById('update-minPurchaseAmount')
              if(minPurchaseAmount.value < 0 || minPurchaseAmount.value == ''){
                minPurchaseAmount.classList.add('is-invalid');
                isValid = false
              }else {
                minPurchaseAmount.classList.remove('is-invalid');
                minPurchaseAmount.classList.add('is-valid')
              }

              const startDate = document.getElementById('update-startDate');
              const endDate = document.getElementById('update-endDate');
              // kiểm tra ngày bắt đầu
              if(startDate.value == ''){
                startDate.classList.add('is-invalid')
                isValid = false
              }else {
                startDate.classList.remove('is-invalid')
              }
              // kiểm tra ngày kết thúc
              if(endDate.value == ""){
                endDate.classList.add('is-invalid')
                isValid = false;
              }else {
                endDate.classList.remove('is-invalid')
              }
              // kiểm tra ngày bắt đầu có trước ngày kết thúc không
              if(startDate.value != '' && endDate.value != '' && !checkStartBeforeEnd(startDate.value, endDate.value)){
                toast_message.innerHTML = "Vui lòng chọn ngày bắt đầu trước ngày kết thúc"
                showToast()
                isValid = false;
                return;
              }

              const brandIds = document.getElementById('update-brand')
              if (brandIds.selectedOptions.length <= 0) {
                showToast()
                toast_message.innerHTML = "Vui lòng chọn brand để áp dụng mã"
                isValid = false;
              } 
              // Nếu form hợp lệ, cho phép submit
              if (isValid && formUpdate.checkValidity()) {
                updateVoucher();
                // Đóng modal nếu form hợp lệ
                modalUpdate.hide();
              }
          })
        })();

        function resetForm() {
          var form = document.getElementById('form-update');
          
          // Xóa các class is-invalid và is-valid khỏi tất cả các trường input
          var inputs = form.querySelectorAll('input');
          inputs.forEach(function(input) {
            input.classList.remove('is-invalid');
            input.classList.remove('is-valid');
          });

          // Xóa class 'was-validated' khỏi form
          form.classList.remove('was-validated');

          // Reset giá trị form nếu cần
          form.reset(); // Tùy chọn nếu bạn muốn reset luôn giá trị form
        }

        // Lắng nghe sự kiện khi modal được đóng
        var modal = document.getElementById('modal-update');
        modal.addEventListener('hidden.bs.modal', function () {
          resetForm(); // Gọi hàm reset form khi modal đóng
        });
      // End validation form create

      // Start Fillter
      const fillter = async () => {
        type = select_fill_type.value;
        isActive = select_fill_isActive.value;
        selectBrand = select_fill_brand.value;
        minDiscount = input_minDiscount.value;
        maxDiscount = input_maxDiscount.value;
        minAmount = input_minPurchaseAmount.value;
        maxAmount = input_maxPurchaseAmount.value;
        search(keywork);
      }

      const reset = () => {
        select_fill_brand.value = "";
        select_fill_type.value = "";
        select_fill_isActive.value = "";
        input_maxDiscount.value = "";
        input_minDiscount.value = "";
        input_minPurchaseAmount.value = "";
        input_maxPurchaseAmount.value = "";
        search_input.value = "";

        type = null;
        isActive = null;
        selectBrand = null;
        minDiscount = null;
        maxDiscount = null;
        minAmount = null;
        maxAmount = null;
        keywork = "";

        search(keywork);
      }
      // End Fillter
    
      // Search Start
      const search_input = document.getElementById("search-input");

      // Call api lấy data search được
      const search = async (keywork) => {
        const url =  new URL("http://localhost:8080/v1/voucher/search")

        if (type) url.searchParams.append("type", type);
        if (isActive) url.searchParams.append("isActive", isActive);
        if (minAmount) url.searchParams.append("minAmount", minAmount);
        if (maxAmount) url.searchParams.append("maxAmount", maxAmount);
        if (minDiscount) url.searchParams.append("minDiscount", minDiscount);
        if (maxDiscount) url.searchParams.append("maxDiscount", maxDiscount);
        if (selectBrand) url.searchParams.append("brandId", selectBrand)
        if (keywork) url.searchParams.append("keywork", keywork);
        if (size) url.searchParams.append("size", size);
        if (page) url.searchParams.append("page", page);

        await fetch(url)
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json(); // Giả sử server trả về JSON
          })
          .then((data) => {
            updateResult(data); // Cập nhật kết quả vào DOM
          })
          .catch((error) => {
            console.error("Fetch operation error:", error);
          });
      };

      // Nếu người dùng nhập liên tục trong 0.5s thì không thực hiện search
      let searchTimeOut = null;
      const inputHandler = (e) => {
        let selects = document.querySelector(".selectpicker");
        let selectedValues = Array.from(selects.selectedOptions).map(option => option.value);
        
        if (searchTimeOut) {
          clearTimeout(searchTimeOut);
        }
        searchTimeOut = setTimeout(() => {
          keywork = e.target.value;
          if (keywork.length < 2 && keywork.length != 0) {
            return;
          }
          search(e.target.value.trim());
        }, 500);
      };
      search_input.addEventListener("input", inputHandler);

      // Hiển thị danh sách voucher nhận được từ response
      function updateResult(data) {
        const tableBody = document.getElementById("result");
        const noResultsRow = document.getElementById("no-results");
        tableBody.innerHTML = ""; // Xóa dữ liệu cũ

        // Duyệt qua danh sách voucher và cập nhật DOM
        if (
          data &&
          data._embedded &&
          Array.isArray(data._embedded.voucherList)
        ) {
          data._embedded.voucherList.forEach((item) => {
            if (item.id) {
              const tr = document.createElement("tr");
              let type = item.type == 'percentage'? '%' : 'đ';
              let isActive = item.isActive? "Hoạt động" : "Không hoạt động";
              let usageLimit = item.usageLimit != null? item.usageLimit : "Không giới hạn"
              let userLimit = item.userLimit != null? item.userLimit : "Không giới hạn"
              tr.innerHTML =
                "<td><input type='checkbox' onchange='handleCheckbox()' class='checkbox-item' value=" + item.id + " /></td>"+
                "<td>" + item.discount.toLocaleString()+" "+type+
                  (item.maxDiscount != null ? " (Tối đa " + item.maxDiscount.toLocaleString() +" )" : "") + 
                "</td>"+
                "<td>" + item.minPurchaseAmount.toLocaleString() + " đ</td>"+
                "<td>" + usageLimit + "</td>"+
                "<td>" + userLimit + "</td>"+
                "<td>" + item.startDate + "</td>"+
                "<td>" + item.endDate + "</td>"+
                "<td>" + isActive + "</td>"+
                "<td><textarea style='max-width: 300px; max-height: 100px; overflow-y: auto;border: 0px; background-color: rgba(0, 0, 0, 0.0);'" +
                ">"+item.description+"</textarea></td>"+
                "<td><button type='button' onclick='findVoucherById("+item.id+")' class='btn btn-warning'>Sửa</button></td>"
              ;
              tableBody.appendChild(tr); // Thêm hàng mới vào `tbody`
            }
          });
          let page = data.page
            createPagination(page.number + 1, page.totalPages, page.size)
          noResultsRow.style.display = "none"; // Ẩn thông báo không có kết quả
        } else {
          noResultsRow.style.display = ""; // Bật thông báo không có kết quả
          createPagination(-1,0,0)
        }
      }
      // End Search

      // Start Cập nhật trạng thái voucher 

      const btn_delete = document.getElementById('btn-delete');
      const selectAllCheckbox = document.getElementById('selectAll');

      // Thay đổi checkbox
      let ids = [];
      const handleCheckbox = () => {
        const checkedBoxes = document.querySelectorAll('.checkbox-item:checked'); // Chỉ lấy checkbox được chọn
        const allCheckboxes = document.querySelectorAll('.checkbox-item');

        ids = Array.from(checkedBoxes).map(checkbox => Number(checkbox.value)); // Lấy các giá trị của checkbox được chọn
        
        // Hiển thị nút nếu có 1 checkbox được chọn, ẩn nếu không có checkbox nào được chọn
        if (ids.length === 1) {
          btn_delete.style.display = "";
        } else if (ids.length === 0) {
          btn_delete.style.display = "none";
          selectAllCheckbox.checked = false; // Bỏ chọn checkbox "Chọn tất cả" nếu không có checkbox nào được chọn
        }

        // Kiểm tra nếu tất cả các checkbox đã được chọn thì chọn luôn checkbox "Chọn tất cả"
        if (ids.length === allCheckboxes.length) {
          selectAllCheckbox.checked = true;
        } else {
          selectAllCheckbox.checked = false;
        }
      }

      // Call api update isActive
      const updateIsActive = async (isActiveUpdate) => {
        
        const url =  new URL("http://localhost:8080/v1/voucher/updateActive")

        if (type) url.searchParams.append("type", type);
        if (isActive !== null) url.searchParams.append("isActive", isActive);
        if (minAmount) url.searchParams.append("minAmount", minAmount);
        if (maxAmount) url.searchParams.append("maxAmount", maxAmount);
        if (minAmount) url.searchParams.append("minDiscount", minDiscount);
        if (maxAmount) url.searchParams.append("maxDiscount", maxDiscount);
        if (keywork) url.searchParams.append("keywork", keywork);
        ids.forEach(id => url.searchParams.append("ids", id)) 
        url.searchParams.append("isActiveUpdate", isActiveUpdate)

        await fetch(url)
        .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json(); // Giả sử server trả về JSON
          })
          .then((data) => {
            ids = [];
            updateResult(data); // Cập nhật kết quả vào DOM
            handleCheckbox();
            toast_message.innerHTML = "Thay đổi trạng thái thành công"
            showToast()
          })
          .catch((error) => {
            console.error("Fetch operation error:", error);
          });
      }

      // Chọn/bỏ chọn tất cả checkbox
      selectAllCheckbox.addEventListener('change', () => {
        const checkboxes = document.querySelectorAll('.checkbox-item');
        if(selectAllCheckbox.checked){
          checkboxes.forEach(checkbox => checkbox.checked = true)
          btn_delete.style.display = "";
        }else{
          checkboxes.forEach(checkbox => checkbox.checked = false)
        }
        handleCheckbox();
      }) 

      // End Cập nhật trạng thái voucher

      // Start Hiển thị max disocunt
      const div = document.querySelectorAll('.div-maxDiscount')
      const handleRadioType = () => {
        let radioPercentage = document.getElementById('percentage')
        let radioUpPercentage = document.getElementById('update-percentage')
        if(radioPercentage.checked){
            div[0].style.display = "";
        }else {
          div[0].style.display = "none";
        }
        if(radioUpPercentage.checked){
          div[1].style.display = ""
        }
        else {
          div[1].style.display = "none"
        }
      }
      // End hiển thị max discount

      const updatePageSize = () => {
        size = document.getElementById('pageSizeSelect').value
        search(keywork)
      }

      // Start Cập nhật voucher
      const selectsUpdateBrand = document.querySelector('#update-brand');
      const updateDiscount =  document.getElementById('update-discount');
      const updateMinPurchaseAmount = document.getElementById('update-minPurchaseAmount');
      const updateUsageLimit = document.getElementById('update-usageLimit');
      const updateUserLimit = document.getElementById('update-userLimit');
      const updateStartDate = document.getElementById('update-startDate');
      const updateEndDate = document.getElementById('update-endDate');
      const updateDescription = document.getElementById('update-description');
      const updateMaxDiscount = document.getElementById('update-maxDiscount');
      const updateRadioType = document.getElementsByName('update-type');
      const updateRadioIsActive = document.getElementsByName('update-isActive'); 
      let idVoucher = null;
      

      const updateVoucher = async () => {
        try {
          let isActive;
          updateRadioIsActive.forEach(p => {
            if(p.checked) return isActive = p
          })
          let type;
          updateRadioType.forEach(p => {
            if(p.checked) return type = p
          })
          const voucher = {
            id: idVoucher,
            discount: parseFloat(updateDiscount.value),
            minPurchaseAmount: parseFloat(updateMinPurchaseAmount.value),
            usageLimit: parseInt(updateUsageLimit.value) || null,
            userLimit: parseInt(updateUserLimit.value) || null,
            startDate: updateStartDate.value,
            endDate: updateEndDate.value,
            maxDiscount: parseFloat(updateMaxDiscount.value) || null,
            description: updateDescription.value,
            type: type.value,
            isActive: isActive.value == 1? true : false
          };
          
          const brandIds = Array.from(selectsUpdateBrand.selectedOptions)
                            .map(option => option.value)
                            .join('&brandIds=');

            const response = await fetch('http://localhost:8080/v1/voucher/update?brandIds='+brandIds, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(voucher)
          }) 
          if (response.ok) {
            search(keywork);
            toast_message.innerHTML = "Cập nhật thành công"
            showToast()
          } else {
              const errorText = await response.text();
              throw new Error(`Error ${response.status}: ${errorText}`);
          }
        } catch (error) {
          console.error("Lỗi khi cập nhật voucher:", error);
        }
      }
      // End Cập nhật voucher

      // Start tìm voucher theo id
      const findVoucherById = async (id) => {
        await fetch('http://localhost:8080/v1/voucher/get/'+id)
        .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json(); // Giả sử server trả về JSON
          })
          .then((data) => {
            setResultForModalUpdate(data);
            idVoucher = data.id;
          })
          .catch((error) => {
            console.error("Fetch operation error:", error);
          });
      }
      // End tìm voucher theo id

      // Start lấy dữ liệu hiển thị lên modal cập nhật
      const setResultForModalUpdate = (result) => {
        updateDiscount.value = result.discount;
        updateMinPurchaseAmount.value = result.minPurchaseAmount;
        updateUsageLimit.value = result.usageLimit;
        updateUserLimit.value = result.userLimit;
        updateStartDate.value = result.startDate;
        updateEndDate.value = result.endDate;
        updateDescription.value = result.description;
        if(result.type == 'percentage'){
          document.getElementById('update-percentage').checked = true
          updateMaxDiscount.value = result.maxDiscount;
          div[1].style.display = "";
        } else {
          document.getElementById('update-fixed-amount').checked = true;
          updateMaxDiscount.value = ""
          div[1].style.display = "none"
        }
        updateRadioIsActive.forEach((p) => {
          if(p.value == result.isActive) p.checked = true;
        })
        Array.from(selectsUpdateBrand.options).forEach((option) =>  {
            if (result?.brandVouchers?.map(b => b.brand.id).includes(parseInt(option.value))) {
                option.selected = true; // Chọn option
            }
        });
        $('.selectpicker').selectpicker('refresh');
        modalUpdate.show();
      }
      // End lấy dữ liệu hiển thị lên modal cập nhật

    </script>

<!-- Phân trang -->
    <script>
      let resultPage = "${currentPage}";
      let resultTotalPages = "${totalPages}";
      let reusultSize = "${pageSize}";
      

    // Tạo phân trang khi trang được tải
      function createPagination(currentPage, totalPages, pageSize) {
          let paginationContainer = document.getElementById('paginationList');
          paginationContainer.innerHTML = '';  // Xóa nội dung cũ
          if(currentPage == -1) {
            document.getElementById('pagination-container').style.display = "none";
            return;
          }else {
            document.getElementById('pagination-container').style.display = "";
          }
          let paginationList = document.createElement('ul');
          paginationList.classList.add('pagination-custom');

          let maxPagesToShow = 5;
          
          // Thêm nút Previous
          let prevItem = document.createElement('li');
          if(currentPage == 1) prevItem.classList.add('disabled');
          else prevItem.classList.remove('disabled');
          prevItem.innerHTML = `<a href="#" onclick="goToPage(`+(currentPage - 1 <= 0? 1 : currentPage - 1)+`)">Previous</a>`;
          paginationList.appendChild(prevItem);

          // Tính toán bắt đầu và kết thúc trang
          let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
          let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

          // Điều chỉnh nếu số trang bắt đầu nhỏ hơn 1
          if (endPage - startPage + 1 < maxPagesToShow) {
              startPage = Math.max(1, endPage - maxPagesToShow + 1);
          }
          // Thêm dấu "..." vào đầu nếu có nhiều trang hơn để hiển thị
          if (startPage > 1) {
              let firstPageItem = document.createElement('li');
              firstPageItem.innerHTML = `<a href="#" onclick="goToPage(1)">1</a>`;
              paginationList.appendChild(firstPageItem);

              let dotsItem = document.createElement('li');
              dotsItem.innerHTML = `<span>...</span>`;
              paginationList.appendChild(dotsItem);
          }

          // Thêm các trang chính
          for (let i = startPage; i <= endPage; i++) {
              let pageItem = document.createElement('li');
              if(i == currentPage){
                pageItem.classList.add('active');
              }
              pageItem.innerHTML = `<a href="#" style='padding: 10px 15px' onclick="goToPage(`+i+`)">`+i+`</a>`;
              paginationList.appendChild(pageItem);
          }

          // Thêm dấu "..." vào cuối nếu có nhiều trang hơn để hiển thị
          if (endPage < totalPages) {
              let dotsItem = document.createElement('li');
              dotsItem.innerHTML = `<span>...</span>`;
              paginationList.appendChild(dotsItem);

              let lastPageItem = document.createElement('li');
              lastPageItem.innerHTML = `<a href="#" onclick="goToPage(${totalPages})">${totalPages}</a>`;
              paginationList.appendChild(lastPageItem);
          }
          
          // Thêm nút Next
          let nextItem = document.createElement('li');
          if (currentPage == totalPages) nextItem.classList.add('disabled');
          else nextItem.classList.remove('disabled');
          nextItem.innerHTML = `<a href="#" onclick="goToPage(`+(currentPage + 1 > totalPages? currentPage : currentPage + 1)+`)">Next</a>`;
          paginationList.appendChild(nextItem);

          paginationContainer.appendChild(paginationList);
      }

      // Hàm để xử lý khi chuyển trang
      function goToPage(pageNumber) {
          // Chạy lại phân trang với trang mới
          createPagination(pageNumber, resultTotalPages, reusultSize);
          // Logic xử lý dữ liệu trang hiện tại (tùy chỉnh của bạn)
          page = pageNumber - 1;
          search(keywork)
      }

      // Khởi tạo phân trang ban đầu
      document.addEventListener('DOMContentLoaded', function() {
        goToPage(1);  // Hiển thị trang đầu tiên khi tải trang
      });
  </script>
  </body>
</html>
