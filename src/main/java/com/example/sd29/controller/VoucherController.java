package com.example.sd29.controller;

import com.example.sd29.entity.Brand;
import com.example.sd29.entity.Brand_Voucher;
import com.example.sd29.entity.Customer;
import com.example.sd29.entity.Customer_Voucher;
import com.example.sd29.entity.Voucher;
import com.example.sd29.repository.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Controller
@CrossOrigin(origins = "*")
@RequestMapping("/v1/voucher")
public class VoucherController {
    private final VoucherRepository voucherRepository;
    private final Customer_VoucherRepository customerVoucherRepository;
    private final CustomerRepository customerRepository;
    private final Brand_VoucherRepository brandVoucherRepository;
    private final BrandRepository brandRepository;
    private final PagedResourcesAssembler<Voucher> pagedResourcesAssembler;
    private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm");

    @Autowired
    public VoucherController(VoucherRepository voucherRepository, Customer_VoucherRepository customerVoucherRepository, CustomerRepository customerRepository,
                             Brand_VoucherRepository brandVoucherRepository, PagedResourcesAssembler<Voucher> pagedResourcesAssembler,
                             BrandRepository brandRepository) {
        this.customerRepository = customerRepository;
        this.pagedResourcesAssembler = pagedResourcesAssembler;
        this.voucherRepository = voucherRepository;
        this.customerVoucherRepository = customerVoucherRepository;
        this.brandVoucherRepository = brandVoucherRepository;
        this.brandRepository = brandRepository;
    }

    @GetMapping("/getAll")
    public String getAll(@RequestParam(value = "size", defaultValue = "5") Integer size,
            @RequestParam(value = "page", defaultValue = "0") Integer page,
            Model model) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Voucher> result = voucherRepository.findAllByOrderByCreateAtDesc(pageable);
        List<Brand> brands = brandRepository.findAll();
        model.addAttribute("voucher", new Voucher());
        model.addAttribute("brands", brands);
        model.addAttribute("data", result);
        model.addAttribute("currentPage", result.getNumber() + 1); // Trang hiện tại (0-based nên +1)
        model.addAttribute("totalPages", result.getTotalPages()); // Tổng số trang
        model.addAttribute("pageSize", result.getSize());
        return "voucher";
    }

    @GetMapping("/search")
    @ResponseBody
    public PagedModel<?> getSearch(
        @RequestParam(value = "size", defaultValue = "5") Integer size,
        @RequestParam(value = "page", defaultValue = "0") Integer page,
        @RequestParam(required = false) String type,
        @RequestParam(required = false) Integer brandId,
        @RequestParam(required = false) Boolean isActive,
        @RequestParam(required = false) Double minAmount,
        @RequestParam(required = false) Double maxAmount,
        @RequestParam(required = false) Double minDiscount,
        @RequestParam(required = false) Double maxDiscount,
        @RequestParam(required = false) String keywork) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Voucher> result = voucherRepository
        .searchVouchers(keywork, type, brandId, isActive, minAmount, maxAmount, minDiscount, maxDiscount, pageable);
        if(page != 0 && result.getContent().isEmpty()) {
            page = 0;
            pageable = PageRequest.of(page, size);
            result = voucherRepository
                    .searchVouchers(keywork, type, brandId, isActive, minAmount, maxAmount, minDiscount, maxDiscount, pageable);
        }
        return pagedResourcesAssembler.toModel(result);
    }
    
    @PostMapping("/create")
    public String create(@ModelAttribute("voucher") Voucher voucher, @RequestParam List<Integer> brandIds) {
        validStartDateAndEndDate(voucher.getStartDate(), voucher.getEndDate());
        if(voucher.getType().equalsIgnoreCase("percentage")){
            if(voucher.getDiscount() > 100)
                voucher.setDiscount(100.0);
        }
        Voucher saved = voucherRepository.save(voucher);
        List<Customer> customers = customerRepository.findAll();
        if(!customers.isEmpty())
            createCustomerVoucher(customers, saved);
        if (brandIds != null && brandIds.size() > 0)
            createBrandVoucher(saved, brandIds);
        return "redirect:/v1/voucher/getAll";
    }

    @PostMapping("/update")
    @ResponseBody
    public ResponseEntity<Void> update(@RequestBody Voucher voucher, @RequestParam List<Integer> brandIds) {
        if(!voucher.getType().equalsIgnoreCase("percentage")) voucher.setMaxDiscount(null);
        if(voucher.getType().equalsIgnoreCase("percentage")){
            if(voucher.getDiscount() > 100)
                voucher.setDiscount(100.0);
        }
        voucherRepository.save(voucher);
        List<Customer> customers = customerRepository.findAll();
        createCustomerVoucher(customers, voucher);
        updateBrandVoucher(voucher, brandIds);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/get/{id}")
    @ResponseBody
    public Voucher get(@PathVariable Integer id) {
        Voucher voucher = voucherRepository.findById(id).orElse(null);
        return voucher;
    }

    @GetMapping("/updateActive")
    @ResponseBody
    public PagedModel<?> isActive(
        @RequestParam(value = "size", defaultValue = "5") Integer size,
        @RequestParam(value = "page", defaultValue = "0") Integer page,
        @RequestParam(required = false) String type,
        @RequestParam(required = false) Integer brandId,
        @RequestParam(required = false) Boolean isActive,
        @RequestParam(required = false) Double minAmount,
        @RequestParam(required = false) Double maxAmount,
        @RequestParam(required = false) Double minDiscount,
        @RequestParam(required = false) Double maxDiscount,
        @RequestParam(required = false) String keywork,
        @RequestParam List<Integer> ids,
        @RequestParam Boolean isActiveUpdate
    ) {
        // Lấy danh sách ids và isActive từ request body

        // Tìm tất cả các voucher theo danh sách ids
        List<Voucher> vouchers = voucherRepository.findAllById(ids);

        // Tạo danh sách các voucher cần cập nhật
        List<Voucher> listUpdate = new ArrayList<>();
        vouchers.forEach(voucher -> {
            if (voucher.getIsActive() != isActiveUpdate) {
                voucher.setIsActive(isActiveUpdate);  // Cập nhật trạng thái isActive
                listUpdate.add(voucher);
            }
        });

        
        // Lưu lại các thay đổi
        voucherRepository.saveAll(listUpdate);
        Pageable pageable = PageRequest.of(page, size);
        Page<Voucher> result = voucherRepository
        .searchVouchers(keywork, type, brandId, isActive, minAmount, maxAmount, minDiscount, maxDiscount, pageable);
        return pagedResourcesAssembler.toModel(result);
    }

    private void validStartDateAndEndDate(LocalDateTime startDate, LocalDateTime endDate) {
        if (startDate.isAfter(endDate)) {
            throw new IllegalArgumentException("Start date cannot be after end date");
        }
        if (startDate.equals(endDate) &&
                (startDate.toLocalTime().isAfter(endDate.toLocalTime()) ||
                        startDate.toLocalTime().equals(endDate.toLocalTime()))) {
            throw new IllegalArgumentException("Start date cannot be after end date");
        }
    }

    private void createCustomerVoucher(List<Customer> customers, Voucher voucher) {
        try {
            List<Customer_Voucher> oldCustomerVoucher = customerVoucherRepository.findByVoucher_Id(voucher.getId());

            // Lấy ra danh sách khách hàng chưa có voucher
            Set<Customer> customersWithVoucher = oldCustomerVoucher.stream()
                    .map(Customer_Voucher::getCustomer) // Lấy ra đối tượng Customer
                    .collect(Collectors.toSet());

            // Tìm những khách hàng chưa có voucher bằng cách so sánh với danh sách trên
            Set<Customer> customerAdd = customers.stream()
                    .filter(customer -> !customersWithVoucher.contains(customer)) // So sánh với danh sách khách hàng đã có voucher
                    .collect(Collectors.toSet());

            // Thêm mới các bản ghi cho các khách hàng chưa có voucher
            for (Customer customer : customerAdd) {
                Customer_Voucher customerVoucher = new Customer_Voucher();
                customerVoucher.setCustomer(customer);
                customerVoucher.setVoucher(voucher);
                if (voucher.getUserLimit() != null)
                    customerVoucher.setQuantity(voucher.getUserLimit());
                customerVoucherRepository.save(customerVoucher);
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    private void createBrandVoucher(Voucher voucher, List<Integer> ids) {
        try {
            List<Brand_Voucher> brandVouchers = new ArrayList<>();
            ids.forEach(p -> {
                Brand_Voucher brandVoucher = new Brand_Voucher();
                brandVoucher.setVoucher(voucher);
                Brand brand = new Brand();
                brand.setId(p);
                brandVoucher.setBrand(brand);
                brandVouchers.add(brandVoucher);
            });
            brandVoucherRepository.saveAll(brandVouchers);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    private void updateBrandVoucher(Voucher voucher, List<Integer> ids) {
        List<Brand_Voucher> oldBrandVouchers = brandVoucherRepository.findByVoucher_Id(voucher.getId());

        // Lấy ra danh sách id brand đã có trong voucher này
        Set<Integer> existingBrandIds = oldBrandVouchers.stream()
                .map(p -> p.getBrand().getId())
                .collect(Collectors.toSet());

        // Lấy ra danh sách id cần thêm mới (lấy những id có trong ids nhưng k có trong existingBrandIds)
        List<Integer> idsToAdd = ids.stream()
                .filter(id -> !existingBrandIds.contains(id)).toList();

        // Tìm những ID cần xóa (lấy những id có trong existingBrandIds mà k có trong ids)
        List<Integer> idsToRemove = existingBrandIds.stream()
                .filter(id -> !ids.contains(id)).toList();

        // Thêm các bản ghi mới
        idsToAdd.forEach(p -> {
            Brand_Voucher brandVoucher = new Brand_Voucher();
            brandVoucher.setVoucher(voucher);
            Brand brand = new Brand();
            brand.setId(p);
            brandVoucher.setBrand(brand);
            brandVoucherRepository.save(brandVoucher);
        });

        // Xoá các bản ghi không có trong danh sách ids mới
        idsToRemove.forEach(brandVoucherRepository::deleteById);
    }
}
