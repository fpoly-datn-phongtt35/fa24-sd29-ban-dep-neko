package com.example.sd29.repository;

import com.example.sd29.entity.Customer_Voucher;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface Customer_VoucherRepository extends JpaRepository<Customer_Voucher, Integer> {
    List<Customer_Voucher> findByVoucher_Id(int id);
}
