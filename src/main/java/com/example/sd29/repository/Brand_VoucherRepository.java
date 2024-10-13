package com.example.sd29.repository;

import com.example.sd29.entity.Brand_Voucher;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface Brand_VoucherRepository extends JpaRepository<Brand_Voucher, Integer> {
    List<Brand_Voucher> findByVoucher_Id(int id);
}
