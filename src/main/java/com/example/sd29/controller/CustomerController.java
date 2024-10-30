package com.example.sd29.controller;

import com.example.sd29.entity.Customer;
import com.example.sd29.repository.CustomerRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Controller
@RequestMapping("/dep")
public class CustomerController {

    @Autowired
    private CustomerRepository customerRepository;


    @ModelAttribute("dsKh")
    public List<Customer> getList() {
        return customerRepository.findAll();
    }

    @GetMapping("/hien-thi")
    public String hienThi(@RequestParam(defaultValue = "0")Integer p, Model model) {
        Pageable pageable= PageRequest.of(p,5);

        Page<Customer> page=customerRepository.findAll(pageable);
        model.addAttribute("p", new Customer());
        model.addAttribute("page", page);
        return "/customer";
    }

    @PostMapping("/add")
    public String add(@Valid @ModelAttribute("customer") Customer customer, BindingResult rs) {
        if (rs.hasErrors()) {
            return "/dep/customer";
        } else {
            customerRepository.save(customer);
            return "redirect:/dep/hien-thi";
        }
    }


    @RequestMapping("/delete/{id}")
    public String delete(@PathVariable Integer id, Model model) {
        customerRepository.deleteById(id);
        model.addAttribute("listDV", customerRepository.findAll());
        return "redirect:/dep/hien-thi";

    }

    @RequestMapping("/detail/{id}")
    public String detail(@PathVariable Integer id, Model model) {
        Customer customer = customerRepository.findById(id).orElse(null);
        model.addAttribute("customer", customer);
        model.addAttribute("list", customerRepository.findAll());
        return "form";
    }
    @PostMapping("/update/{id}")
    public String update(@PathVariable Integer id,
                         @Valid  @ModelAttribute("dv") Customer dv, BindingResult rs){
        if (rs.hasErrors()){
            return "form";
        }
        dv.setId(id);
        customerRepository.save(dv);
        return "redirect:/dep/hien-thi";
    }

    @GetMapping("/search")
    public String search(@RequestParam(defaultValue = "0") Integer p,
                         @RequestParam(required = false) String keyword,
                         Model model) {
        Pageable pageable = PageRequest.of(p, 5);
        Page<Customer> page;

        // Kiểm tra nếu có từ khóa tìm kiếm
        if (keyword != null && !keyword.isEmpty()) {
            page = customerRepository.searchByKeyword(keyword, pageable);
            model.addAttribute("keyword", keyword);
        } else {
            page = customerRepository.findAll(pageable);
        }

        model.addAttribute("p", new Customer());
        model.addAttribute("page", page);
        return "customer";
    }
    @GetMapping("/filterByCity")
    public String filterByCity(@RequestParam("city") String city, Model model) {
        // Truy vấn tìm kiếm khách hàng theo thành phố
        List<Customer> customers = customerRepository.findByCity(city);
        // Đưa kết quả vào model để hiển thị trên trang JSP
        model.addAttribute("customers", customers);
        return "customer"; // Tên của trang JSP hiển thị danh sách khách hàng



    }
}
