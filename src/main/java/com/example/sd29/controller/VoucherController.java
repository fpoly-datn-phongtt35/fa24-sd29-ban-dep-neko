package com.example.sd29.controller;

import com.example.sd29.entity.Brand_Voucher;
import com.example.sd29.entity.Customer_Voucher;
import com.example.sd29.entity.Voucher;
import com.example.sd29.repository.Brand_VoucherRepository;
import com.example.sd29.repository.Customer_VoucherRepository;
import com.example.sd29.repository.VoucherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Set;

@Controller
@RequestMapping("/v1/voucher")
public class VoucherController {
    private final VoucherRepository voucherRepository;
    private final Customer_VoucherRepository customerVoucherRepository;
    private final Brand_VoucherRepository brandVoucherRepository;
    private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm");

    @Autowired
    public VoucherController(VoucherRepository voucherRepository, Customer_VoucherRepository customerVoucherRepository, Brand_VoucherRepository brandVoucherRepository) {
        this.voucherRepository = voucherRepository;
        this.customerVoucherRepository = customerVoucherRepository;
        this.brandVoucherRepository = brandVoucherRepository;
    }

    @GetMapping("/getAll")
    public String getAll(@RequestParam(value = "size", defaultValue = "5") Integer size,
                         @RequestParam(value = "page", defaultValue = "0") Integer page,
                         Model model) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Voucher> result = voucherRepository.findAllByOrderByIdDesc(pageable, "");
        model.addAttribute("voucher", new Voucher());
        model.addAttribute("data", result);
        return "voucher";
    }

    @GetMapping("/search")
    public String getSearch(
            @RequestParam(value = "size", defaultValue = "5") Integer size,
            @RequestParam(value = "page", defaultValue = "0") Integer page,
            Model model,
            @RequestParam(value = "keywork", defaultValue = "") String keywork){
        Pageable pageable = PageRequest.of(page, size);
        Page<Voucher> result = voucherRepository.findAllByOrderByIdDesc(pageable, keywork);
        model.addAttribute("data", result);
        return "voucher";
    }

    @PostMapping
    public String create(@ModelAttribute("voucher") Voucher voucher) {
        Set<Customer_Voucher> customerVouchers = voucher.getCustomerVouchers();
        Set<Brand_Voucher> brandVouchers = voucher.getBrandVouchers();
        validStartDateAndEndDate(voucher.getStartDate(), voucher.getEndDate());
        Voucher saved = voucherRepository.save(voucher);
        if(customerVouchers != null && customerVouchers.size() > 0)
            createCustomerVoucher(saved, customerVouchers);
        if(brandVouchers != null && brandVouchers.size() > 0)
            createBrandVoucher(saved, brandVouchers);

        return "redirect:/v1/voucher/getAll";
    }

    @PutMapping
    public String update(Model model, @ModelAttribute("voucher") Voucher voucher) {
        voucherRepository.save(voucher);
        return "redirect:/v1/voucher/";
    }

    @GetMapping("get/{id}")
    public String get(Model model, @PathVariable Integer id) {
        Voucher voucher = voucherRepository.findById(id).orElse(null);
        model.addAttribute("voucher", voucher);
        return "voucher.jsp";
    }

    @DeleteMapping
    public String isActive(Model model, @RequestParam List<Integer> ids) {
        List<Voucher> vouchers = voucherRepository.findAllById(ids);
        vouchers.forEach(voucher -> voucher.setIsActive(!voucher.getIsActive()));
        voucherRepository.saveAll(vouchers);
        return "redirect:/v1/voucher/getAll";
    }

    private void validStartDateAndEndDate(LocalDateTime startDate, LocalDateTime endDate) {
        if(startDate.isAfter(endDate)){
            throw new IllegalArgumentException("Start date cannot be after end date");
        }
        if(startDate.equals(endDate) &&
            (startDate.toLocalTime().isAfter(endDate.toLocalTime()) ||
            startDate.toLocalTime().equals(endDate.toLocalTime())))
        {
            throw new IllegalArgumentException("Start date cannot be after end date");
        }
    }

    private void createCustomerVoucher(Voucher voucher, Set<Customer_Voucher> customerVouchers) {
        try {
            customerVouchers.forEach(p -> p.setVoucher(voucher));
            customerVoucherRepository.saveAll(customerVouchers);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    private void createBrandVoucher(Voucher voucher, Set<Brand_Voucher> brandVouchers) {
        try {
            brandVouchers.forEach(p -> p.setVoucher(voucher));
            brandVoucherRepository.saveAll(brandVouchers);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
