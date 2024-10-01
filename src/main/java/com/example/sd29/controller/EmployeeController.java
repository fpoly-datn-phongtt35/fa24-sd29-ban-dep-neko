package com.example.sd29.controller;

import com.example.sd29.entity.Employee;
import com.example.sd29.entity.Role;
import com.example.sd29.repository.EmployeeRepository;
import com.example.sd29.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Controller
@RequestMapping("/employee")
public class EmployeeController {

    Integer pp = 0;
    @Autowired
    EmployeeRepository employeeRepository;

    @Autowired
    RoleRepository roleRepository;


    @ModelAttribute("listRole")
    public List<Role> getAllRole() {
        return roleRepository.findAll();
    }


    @GetMapping("/hien-thi")
    public String hienThi(@RequestParam(defaultValue = "0")Integer p, Model model) {
        Pageable pageable= PageRequest.of(p,5);

        Page<Employee> page=employeeRepository.findAll(pageable);
        model.addAttribute("p", new Employee());
        model.addAttribute("page", page);
        return "employee";
    }

    @PostMapping("/add")
    public String addPhong(@ModelAttribute("p") Employee employee, Model model) {

        employeeRepository.save(employee);
        model.addAttribute("listE", employeeRepository.findAll());
        model.addAttribute("listR", roleRepository.findAll());
        return  "redirect:/employee/hien-thi";
    }


    @GetMapping("/detail/{id}")
    public String detailSach(@PathVariable Integer id, Model model) {
        Employee p = employeeRepository.findById(id).get();
        model.addAttribute("p", p);
        // load table
        Pageable pageable= PageRequest.of(pp,5);
        model.addAttribute("page", employeeRepository.findAll(pageable));
        return "employee";

    }


    @GetMapping("/delete/{id}")
    public String delete(@PathVariable Integer id, Model model) {
        employeeRepository.deleteById(id);
        model.addAttribute("listE", employeeRepository.findAll());
        model.addAttribute("listR", roleRepository.findAll());
        return "redirect:/employee/hien-thi";
    }



    @GetMapping("/view-update/{id}")
    public String viewUpdate(@PathVariable Integer id, Model model) {

        model.addAttribute("p", employeeRepository.findById(id).get());
        return "update";
    }

    @PostMapping("/update/{id}")
    public String update(
            @PathVariable Integer id,
            @ModelAttribute Employee p,
            Model model) {
        employeeRepository.save(p);
        model.addAttribute("listE", employeeRepository.findAll());
        model.addAttribute("listR", roleRepository.findAll());
        return  "redirect:/employee/hien-thi";
    }

    @GetMapping("/search")
    public String search(@RequestParam("name") String name, Model model) {
        List<Employee> employees = employeeRepository.findByNameContaining(name);
        model.addAttribute("listE", employees);
        model.addAttribute("listR", roleRepository.findAll());
        return "employee";
    }



}
