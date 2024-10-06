package com.example.sd29.repository;

import com.example.sd29.entity.Voucher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;


public interface VoucherRepository extends JpaRepository<Voucher, Integer> {
    @Query(nativeQuery = true, value = "SELECT * FROM Voucher WHERE description LIKE %?1% ORDER BY created_at desc")
    Page<Voucher> findAllByOrderByIdDesc(Pageable pageable, String keyword);
}
